from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


RiskLevel = Literal["normal", "warning", "critical"]


class PredictionCreate(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    asset_id: str
    model_id: str
    timestamp: datetime
    failure_probability: float = Field(..., ge=0.0, le=1.0)
    risk_level: RiskLevel


class AssetAssessment(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    asset_id: str
    timestamp: datetime

    temperature: float
    vibration: float
    pressure: float
    current: float

    failure_probability: float = Field(..., ge=0.0, le=1.0)
    risk_level: RiskLevel


class PredictResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    model_id: str
    assessments: list[AssetAssessment]


