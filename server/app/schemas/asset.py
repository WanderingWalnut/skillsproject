from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.prediction import RiskLevel


class AssetStatus(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    asset_id: str
    risk_level: Optional[RiskLevel] = None
    failure_probability: Optional[float] = None
    timestamp: Optional[datetime] = None
    model_id: Optional[str] = None


class AssetsResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    assets: list[AssetStatus]

