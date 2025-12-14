from __future__ import annotations

from datetime import datetime
from dataclasses import dataclass
from pathlib import Path
from typing import Optional
from uuid import uuid4

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split


@dataclass(frozen=True)
class TrainResult:
    model_id: str
    training_date: datetime
    rows_used: int
    assets: int
    positive_rate: float
    metrics: dict[str, float]
    # Python 3.9 compatibility: use Optional instead of `str | None`.
    model_path: Optional[str]


def train_from_dataframe(df: pd.DataFrame) -> TrainResult:
    """
    Train a simple baseline model from the validated training dataframe.

    Expects the output of `validate_training_dataframe()` from processing_service.
    """
    features = ["temperature", "vibration", "pressure", "current"]
    target = "label"

    if any(c not in df.columns for c in features + [target, "asset_id"]):
        raise ValueError("Training dataframe is missing required columns for training")

    y = df[target].astype(int).to_numpy()
    unique = np.unique(y)
    if unique.size < 2:
        # This is common with purely “healthy” datasets. Surface a clear message for the MVP.
        raise ValueError("Training data must contain at least one positive (label=1) and one negative (label=0) row")

    X = df[features].to_numpy(dtype=float)

    n_samples = int(y.shape[0])
    n_classes = int(unique.size)

    # Small datasets are common in demos. For MVP robustness:
    # - if too small to split, train on all rows and return minimal metadata.
    if n_samples < 10:
        model = RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X, y)
        metrics: dict[str, float] = {}
    else:
        # Ensure validation set is large enough to hold at least one sample per class when stratifying.
        val_size = max(int(round(n_samples * 0.2)), n_classes)
        val_size = min(val_size, n_samples - 1)
        test_size = val_size / n_samples

        can_stratify = (
            n_classes == 2
            and (np.bincount(y).min() >= 2)
            and (val_size >= n_classes)
            and (n_samples - val_size >= n_classes)
        )

        X_train, X_val, y_train, y_val = train_test_split(
            X,
            y,
            test_size=test_size,
            random_state=42,
            stratify=y if can_stratify else None,
        )

        model = RandomForestClassifier(
            n_estimators=200,
            random_state=42,
            n_jobs=-1,
        )
        model.fit(X_train, y_train)

        y_pred = model.predict(X_val)
        metrics = {"accuracy": float(accuracy_score(y_val, y_pred))}

        # roc_auc requires probability estimates and both classes present in y_val.
        if np.unique(y_val).size == 2:
            y_prob = model.predict_proba(X_val)[:, 1]
            metrics["roc_auc"] = float(roc_auc_score(y_val, y_prob))

    model_id = str(uuid4())
    training_date = datetime.utcnow()
    artifacts_dir = Path(__file__).resolve().parents[1] / "artifacts" / "models"
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    model_path = artifacts_dir / f"{model_id}.joblib"
    joblib.dump(model, model_path)

    return TrainResult(
        model_id=model_id,
        training_date=training_date,
        rows_used=int(df.shape[0]),
        assets=int(df["asset_id"].nunique()),
        positive_rate=float(np.mean(y)),
        metrics=metrics,
        model_path=str(model_path),
    )


