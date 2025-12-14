from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TrainingDataCreate(BaseModel):
    model_id: str
    asset_id: str
    temperature: float
    vibration: float
    pressure: float
    current: float
    label: int


class TrainingDataResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    model_id: str
    asset_id: str
    temperature: float
    vibration: float
    pressure: float
    current: float
    label: int
    created_at: datetime


