from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.services.processing_service import read_csv_upload, validate_training_dataframe
from app.core.services.train_model_service import train_from_dataframe
from app.schemas.train import TrainResponse

router = APIRouter(tags=["train"])


@router.post("/train", response_model=TrainResponse)
async def train_model(file: UploadFile = File(...)) -> TrainResponse:
    """
    Upload + train in one call (MVP).

    This endpoint is intentionally thin: it delegates parsing/validation and ML training to services.
    """
    try:
        df = await read_csv_upload(file)
        df = validate_training_dataframe(df)
        result = train_from_dataframe(df)

        return TrainResponse(
            model_id=result.model_id,
            rows_used=result.rows_used,
            assets=result.assets,
            positive_rate=result.positive_rate,
            metrics=result.metrics,
            model_path=result.model_path,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Training failed") from e
