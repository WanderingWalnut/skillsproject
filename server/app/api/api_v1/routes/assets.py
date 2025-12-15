from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.crud.assets import (
    get_assets_with_latest_prediction,
    get_latest_prediction_for_asset,
    get_prediction_history_for_asset,
    get_recent_training_samples_for_asset,
)
from app.schemas.asset import (
    AssetDetailResponse,
    AssetStatus,
    AssetsResponse,
    HistoryPoint,
    MetricsSnapshot,
    PredictionSummary,
)

router = APIRouter(tags=["assets"])


@router.get("/assets", response_model=AssetsResponse)
def list_assets(db: Session = Depends(get_db)) -> AssetsResponse:
    """Return unique assets joined with their latest prediction (if any)."""
    rows = get_assets_with_latest_prediction(db)
    assets: list[AssetStatus] = []
    for r in rows:
        assets.append(
            AssetStatus(
                asset_id=r.asset_id,
                risk_level=getattr(r, "risk_level", None),
                failure_probability=getattr(r, "failure_probability", None),
                timestamp=getattr(r, "timestamp", None),
                model_id=getattr(r, "model_id", None),
            )
        )
    return AssetsResponse(assets=assets)


@router.get("/assets/{asset_id}", response_model=AssetDetailResponse)
def get_asset_detail(asset_id: str, db: Session = Depends(get_db)) -> AssetDetailResponse:
    latest = get_latest_prediction_for_asset(db, asset_id)
    hist = get_prediction_history_for_asset(db, asset_id, limit=200)
    samples = get_recent_training_samples_for_asset(db, asset_id, limit=24)

    latest_summary: PredictionSummary | None = None
    if latest is not None:
        latest_summary = PredictionSummary(
            model_id=latest.model_id,
            timestamp=latest.timestamp,
            risk_level=latest.risk_level,  # type: ignore[arg-type]
            failure_probability=latest.failure_probability,
        )

    history_points: list[HistoryPoint] = [
        HistoryPoint(
            model_id=p.model_id,
            timestamp=p.timestamp,
            risk_level=p.risk_level,  # type: ignore[arg-type]
            failure_probability=p.failure_probability,
        )
        for p in hist
    ]

    metrics: MetricsSnapshot | None = None
    if samples:
        # Use the most recent training sample as a metrics snapshot (MVP behavior).
        s = samples[0]
        metrics = MetricsSnapshot(
            temperature=s.temperature,
            vibration=s.vibration,
            pressure=s.pressure,
            current=s.current,
        )

    return AssetDetailResponse(
        asset_id=asset_id,
        latest=latest_summary,
        history=history_points,
        metrics=metrics,
    )
