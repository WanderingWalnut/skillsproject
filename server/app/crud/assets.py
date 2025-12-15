from __future__ import annotations

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.prediction import Prediction
from app.models.training_data import TrainingData


def get_assets_with_latest_prediction(db: Session):
    """
    Return rows shaped as (asset_id, risk_level?, failure_probability?, timestamp?, model_id?)
    for every unique asset observed either in training_data or prediction tables.
    """
    # Distinct assets from training data and predictions; union them for completeness.
    assets_td = db.query(TrainingData.asset_id.label("asset_id")).distinct()
    assets_pred = db.query(Prediction.asset_id.label("asset_id")).distinct()
    assets_union = assets_td.union(assets_pred).subquery("assets")

    # Latest prediction timestamp per asset.
    latest_ts = (
        db.query(
            Prediction.asset_id.label("asset_id"),
            func.max(Prediction.timestamp).label("max_ts"),
        )
        .group_by(Prediction.asset_id)
        .subquery("latest_ts")
    )

    # Join back to predictions to get the whole latest row.
    latest_pred = (
        db.query(
            Prediction.asset_id.label("asset_id"),
            Prediction.risk_level,
            Prediction.failure_probability,
            Prediction.timestamp,
            Prediction.model_id,
        )
        .join(
            latest_ts,
            (Prediction.asset_id == latest_ts.c.asset_id)
            & (Prediction.timestamp == latest_ts.c.max_ts),
        )
        .subquery("latest_pred")
    )

    # Outer join assets with their latest prediction (if any).
    rows = (
        db.query(
            assets_union.c.asset_id,
            latest_pred.c.risk_level,
            latest_pred.c.failure_probability,
            latest_pred.c.timestamp,
            latest_pred.c.model_id,
        )
        .select_from(assets_union)
        .outerjoin(latest_pred, latest_pred.c.asset_id == assets_union.c.asset_id)
        .order_by(assets_union.c.asset_id.asc())
        .all()
    )

    return rows


def get_latest_prediction_for_asset(db: Session, asset_id: str) -> Prediction | None:
    return (
        db.query(Prediction)
        .filter(Prediction.asset_id == asset_id)
        .order_by(Prediction.timestamp.desc(), Prediction.created_at.desc())
        .first()
    )


def get_prediction_history_for_asset(
    db: Session, asset_id: str, *, limit: int = 50
) -> list[Prediction]:
    return (
        db.query(Prediction)
        .filter(Prediction.asset_id == asset_id)
        .order_by(Prediction.timestamp.asc(), Prediction.created_at.asc())
        .limit(limit)
        .all()
    )


def get_recent_training_samples_for_asset(
    db: Session, asset_id: str, *, limit: int = 24
) -> list[TrainingData]:
    return (
        db.query(TrainingData)
        .filter(TrainingData.asset_id == asset_id)
        .order_by(TrainingData.id.desc())
        .limit(limit)
        .all()
    )
