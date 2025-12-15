from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

import joblib
import pandas as pd
from sqlalchemy.orm import Session

from app.core.services.processing_service import read_csv_upload
from app.crud.model_metadata import get_model_by_id
from app.schemas.prediction import AssetAssessment, PredictionCreate, RiskLevel


REQUIRED_INFERENCE_COLUMNS: tuple[str, ...] = (
    "timestamp",
    "asset_id",
    "temperature",
    "vibration",
    "pressure",
    "current",
)


@dataclass(frozen=True)
class PredictResult:
    model_id: str
    assessments: list[AssetAssessment]
    to_persist: list[PredictionCreate]


def _default_artifacts_path(model_id: str) -> Path:
    artifacts_dir = Path(__file__).resolve().parents[1] / "artifacts" / "models"
    return artifacts_dir / f"{model_id}.joblib"


def load_model(*, model_id: str, db: Session):
    meta = get_model_by_id(db, model_id=model_id)
    if not meta:
        raise ValueError(f"Unknown model_id: {model_id}")

    candidate_paths: list[Path] = []
    if meta.model_path:
        candidate_paths.append(Path(meta.model_path))
    candidate_paths.append(_default_artifacts_path(model_id))

    for p in candidate_paths:
        try:
            if p.exists():
                return joblib.load(p)
        except Exception:
            # Try the next candidate (fall back to default artifacts path).
            continue

    raise ValueError("Model artifact not found on disk for this model_id")


def validate_inference_dataframe(
    df: pd.DataFrame, required_cols: Iterable[str] = REQUIRED_INFERENCE_COLUMNS
) -> pd.DataFrame:
    """
    Validate and coerce the inference dataframe to expected types.

    Unlike training, `label` is optional (ignored if present).
    """
    required_cols = tuple(required_cols)
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")

    out = df.loc[:, required_cols].copy()

    out["timestamp"] = pd.to_datetime(out["timestamp"], errors="coerce", utc=True)
    out["asset_id"] = out["asset_id"].astype(str)

    for col in ("temperature", "vibration", "pressure", "current"):
        out[col] = pd.to_numeric(out[col], errors="coerce")

    bad_ts = int(out["timestamp"].isna().sum())
    bad_sensor = int(out[["temperature", "vibration", "pressure", "current"]].isna().any(axis=1).sum())

    if bad_ts or bad_sensor:
        raise ValueError(
            "Invalid values detected after parsing. "
            f"bad_timestamp_rows={bad_ts}, bad_sensor_rows={bad_sensor}"
        )

    return out


def _risk_from_probability(p: float) -> RiskLevel:
    if p < 0.5:
        return "normal"
    if p < 0.8:
        return "warning"
    return "critical"


def _normalize_ts(ts: pd.Timestamp) -> datetime:
    # Store as naive UTC for SQLite simplicity; UI can treat it as UTC.
    dt = ts.to_pydatetime()
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt


async def predict_latest_per_asset_from_upload(*, model_id: str, file, db: Session) -> PredictResult:
    df = await read_csv_upload(file)
    df = validate_inference_dataframe(df)

    if df.empty:
        raise ValueError("CSV contains no rows")

    # Pick the latest timestamp row per asset_id.
    df_sorted = df.sort_values(["asset_id", "timestamp"])
    latest = df_sorted.groupby("asset_id", as_index=False).tail(1).reset_index(drop=True)

    features = ["temperature", "vibration", "pressure", "current"]
    X = latest[features].to_numpy(dtype=float)

    model = load_model(model_id=model_id, db=db)
    if not hasattr(model, "predict_proba"):
        raise ValueError("Loaded model does not support probability predictions (predict_proba)")

    proba = model.predict_proba(X)
    if proba.ndim != 2 or proba.shape[1] < 2:
        raise ValueError("Model probability output is not compatible with binary classification")

    failure_probs = proba[:, 1].astype(float)

    assessments: list[AssetAssessment] = []
    to_persist: list[PredictionCreate] = []

    # Python 3.9 note: zip(strict=...) is only available in Python 3.10+.
    if int(latest.shape[0]) != int(failure_probs.shape[0]):
        raise ValueError("Prediction output length does not match number of assessed rows")

    for row, p in zip(latest.itertuples(index=False), failure_probs):
        ts = _normalize_ts(getattr(row, "timestamp"))
        risk = _risk_from_probability(float(p))

        assessment = AssetAssessment(
            asset_id=str(getattr(row, "asset_id")),
            timestamp=ts,
            temperature=float(getattr(row, "temperature")),
            vibration=float(getattr(row, "vibration")),
            pressure=float(getattr(row, "pressure")),
            current=float(getattr(row, "current")),
            failure_probability=float(p),
            risk_level=risk,
        )
        assessments.append(assessment)
        to_persist.append(
            PredictionCreate(
                asset_id=assessment.asset_id,
                model_id=model_id,
                timestamp=assessment.timestamp,
                failure_probability=assessment.failure_probability,
                risk_level=assessment.risk_level,
            )
        )

    return PredictResult(model_id=model_id, assessments=assessments, to_persist=to_persist)


