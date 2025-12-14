from __future__ import annotations

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.services.processing_service import read_csv_upload, validate_training_dataframe
from app.core.services.train_model_service import train_from_dataframe
from app.crud.model_metadata import create_model_metadata
from app.crud.training_data import create_training_data_bulk
from app.schemas.model_metadata import ModelMetadataCreate
from app.schemas.train import TrainResponse
from app.schemas.training_data import TrainingDataCreate


async def train_and_persist_from_upload(*, file: UploadFile, db: Session) -> TrainResponse:
    """
    Orchestrates the MVP training workflow:
    upload -> parse -> validate -> train -> persist metadata (+ optional training rows).

    Keeps API routes thin and centralizes side effects.
    """
    df = await read_csv_upload(file)
    df = validate_training_dataframe(df)
    result = train_from_dataframe(df)

    settings = get_settings()

    create_model_metadata(
        db,
        ModelMetadataCreate(
            model_id=result.model_id,
            training_date=result.training_date,
            rows_used=result.rows_used,
            assets_count=result.assets,
            positive_rate=result.positive_rate,
            metrics=result.metrics,
            model_path=result.model_path,
        ),
    )

    if settings.STORE_TRAINING_DATA:
        rows: list[TrainingDataCreate] = [
            TrainingDataCreate(
                model_id=result.model_id,
                asset_id=str(r.asset_id),
                temperature=float(r.temperature),
                vibration=float(r.vibration),
                pressure=float(r.pressure),
                current=float(r.current),
                label=int(r.label),
            )
            for r in df.itertuples(index=False)
        ]
        create_training_data_bulk(db, rows)

    return TrainResponse(
        model_id=result.model_id,
        rows_used=result.rows_used,
        assets=result.assets,
        positive_rate=result.positive_rate,
        metrics=result.metrics,
        model_path=result.model_path,
    )


