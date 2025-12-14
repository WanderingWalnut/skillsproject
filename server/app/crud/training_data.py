from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.training_data import TrainingData
from app.schemas.training_data import TrainingDataCreate


def create_training_data_bulk(db: Session, rows: list[TrainingDataCreate]) -> int:
    if not rows:
        return 0
    objs = [
        TrainingData(
            model_id=r.model_id,
            asset_id=r.asset_id,
            temperature=r.temperature,
            vibration=r.vibration,
            pressure=r.pressure,
            current=r.current,
            label=int(r.label),
        )
        for r in rows
    ]
    db.bulk_save_objects(objs)
    db.commit()
    return len(objs)


def get_training_data_by_model(
    db: Session, model_id: str, *, skip: int = 0, limit: int = 1000
) -> list[TrainingData]:
    return (
        db.query(TrainingData)
        .filter(TrainingData.model_id == model_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


