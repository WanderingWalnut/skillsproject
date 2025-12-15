from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.prediction import Prediction
from app.schemas.prediction import PredictionCreate


def create_predictions_bulk(db: Session, rows: list[PredictionCreate]) -> None:
    """
    Bulk insert prediction rows for the MVP.

    We don't return ORM objects to keep this light and avoid extra refresh queries.
    """
    objs = [
        Prediction(
            asset_id=r.asset_id,
            risk_level=r.risk_level,
            failure_probability=r.failure_probability,
            timestamp=r.timestamp,
            model_id=r.model_id,
        )
        for r in rows
    ]
    db.add_all(objs)
    db.commit()


def get_prediction_history(db: Session, asset_id: str, limit: int = 100) -> list[Prediction]:
    """
    Return all predictions for a given asset, ordered by timestamp ascending.
    This provides time-series data for trend visualization.
    """
    return (
        db.query(Prediction)
        .filter(Prediction.asset_id == asset_id)
        .order_by(Prediction.timestamp.asc())
        .limit(limit)
        .all()
    )


