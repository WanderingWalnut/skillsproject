from __future__ import annotations

from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class ModelMetadataCreate(BaseModel):
    model_id: str
    training_date: datetime
    rows_used: int
    assets_count: int
    positive_rate: float
    metrics: dict[str, float]
    model_path: Optional[str] = None


class ModelMetadataResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    model_id: str
    training_date: datetime
    rows_used: int
    assets_count: int
    positive_rate: float
    metrics: dict[str, Any]
    model_path: Optional[str] = None
    created_at: datetime


