from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.crud.assets import get_assets_with_latest_prediction
from app.schemas.asset import AssetStatus, AssetsResponse

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

