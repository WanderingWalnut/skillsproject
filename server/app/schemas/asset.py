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


class PredictionSummary(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    model_id: str
    timestamp: datetime
    risk_level: RiskLevel
    failure_probability: float


class HistoryPoint(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    model_id: str
    timestamp: datetime
    risk_level: RiskLevel
    failure_probability: float


class MetricsSnapshot(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    temperature: float
    vibration: float
    pressure: float
    current: float


class AssetDetailResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    asset_id: str
    latest: Optional[PredictionSummary] = None
    history: list[HistoryPoint] = []
    metrics: Optional[MetricsSnapshot] = None
