from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.services.training_workflow_service import train_and_persist_from_upload
from app.schemas.train import TrainResponse

router = APIRouter(tags=["train"])


@router.post("/train", response_model=TrainResponse)
async def train_model(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> TrainResponse:
    """
    Upload + train in one call (MVP).

    This endpoint is intentionally thin: it delegates parsing/validation and ML training to services.
    """
    try:
        return await train_and_persist_from_upload(file=file, db=db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        # If persistence fails, surface a clear message (still a server error).
        raise HTTPException(status_code=500, detail="Training failed") from e
