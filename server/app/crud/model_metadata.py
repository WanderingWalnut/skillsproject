from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.model_metadata import ModelMetadata
from app.schemas.model_metadata import ModelMetadataCreate


def create_model_metadata(db: Session, obj_in: ModelMetadataCreate) -> ModelMetadata:
    db_obj = ModelMetadata(
        model_id=obj_in.model_id,
        training_date=obj_in.training_date,
        rows_used=obj_in.rows_used,
        assets_count=obj_in.assets_count,
        positive_rate=obj_in.positive_rate,
        metrics=obj_in.metrics,
        model_path=obj_in.model_path,
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj


def get_model_by_id(db: Session, model_id: str) -> ModelMetadata | None:
    return db.query(ModelMetadata).filter(ModelMetadata.model_id == model_id).first()


def get_all_models(db: Session, *, skip: int = 0, limit: int = 100) -> list[ModelMetadata]:
    return db.query(ModelMetadata).offset(skip).limit(limit).all()


