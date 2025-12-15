from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.services.predict_service import predict_latest_per_asset_from_upload
from app.crud.prediction import create_predictions_bulk
from app.schemas.prediction import PredictResponse

router = APIRouter(tags=["predict"])

@router.post("/predict", response_model=PredictResponse)
async def predict_risk(
    model_id: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
) -> PredictResponse:
    """
    MVP risk assessment:
    - load the trained model artifact for model_id
    - read/validate the uploaded CSV (inference columns)
    - select latest timestamp row per asset_id
    - compute failure probability and map to risk level
    - persist predictions and return assessments
    """
    try:
        result = await predict_latest_per_asset_from_upload(model_id=model_id, file=file, db=db)
        create_predictions_bulk(db, result.to_persist)
        return PredictResponse(model_id=model_id, assessments=result.assessments)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Prediction failed") from e


