"""Seed demo data endpoint for development/demo purposes."""

from __future__ import annotations

import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.crud.model_metadata import get_all_models
from app.models.prediction import Prediction

router = APIRouter(tags=["seed"])


class SeedResponse(BaseModel):
    message: str
    predictions_added: int


def _risk_from_probability(p: float) -> str:
    if p < 0.5:
        return "normal"
    if p < 0.8:
        return "warning"
    return "critical"


@router.post("/seed-demo-data", response_model=SeedResponse)
def seed_demo_prediction_history(db: Session = Depends(get_db)) -> SeedResponse:
    """
    Seed the database with varied prediction history for demo purposes.
    Creates interesting time-series data for PUMP_003 (escalating risk)
    and PUMP_001 (fluctuating normal operation).
    """
    # Get an existing model_id to use
    models = get_all_models(db)
    if not models:
        return SeedResponse(message="No trained models found. Train a model first.", predictions_added=0)

    model_id = models[0].model_id
    now = datetime.utcnow()
    predictions_to_add = []

    # PUMP_003: Escalating risk scenario (starts normal, becomes critical)
    # Simulates a degrading pump over 24 hours
    pump_003_data = []
    for i in range(24):
        ts = now - timedelta(hours=24 - i)
        # Gradual increase with some noise, ending at critical
        base_prob = 0.15 + (i / 24) * 0.75  # 0.15 -> 0.90
        noise = random.uniform(-0.05, 0.05)
        prob = max(0.05, min(0.95, base_prob + noise))
        pump_003_data.append((ts, prob))

    for ts, prob in pump_003_data:
        predictions_to_add.append(
            Prediction(
                asset_id="PUMP_003",
                model_id=model_id,
                timestamp=ts,
                failure_probability=prob,
                risk_level=_risk_from_probability(prob),
            )
        )

    # PUMP_001: Normal operation with occasional spikes
    # Simulates a healthy pump with minor fluctuations
    pump_001_data = []
    for i in range(24):
        ts = now - timedelta(hours=24 - i)
        # Low baseline with occasional spikes
        base_prob = 0.12
        if i in [8, 16]:  # Spike hours
            base_prob = 0.35
        noise = random.uniform(-0.08, 0.08)
        prob = max(0.05, min(0.45, base_prob + noise))
        pump_001_data.append((ts, prob))

    for ts, prob in pump_001_data:
        predictions_to_add.append(
            Prediction(
                asset_id="PUMP_001",
                model_id=model_id,
                timestamp=ts,
                failure_probability=prob,
                risk_level=_risk_from_probability(prob),
            )
        )

    # PUMP_002: Warning zone fluctuation
    # Simulates a pump that's been hovering around the warning threshold
    pump_002_data = []
    for i in range(24):
        ts = now - timedelta(hours=24 - i)
        # Fluctuate around warning threshold (50%)
        base_prob = 0.45 + 0.15 * (0.5 + 0.5 * (i % 6) / 6)  # Cycles
        noise = random.uniform(-0.1, 0.1)
        prob = max(0.25, min(0.75, base_prob + noise))
        pump_002_data.append((ts, prob))

    for ts, prob in pump_002_data:
        predictions_to_add.append(
            Prediction(
                asset_id="PUMP_002",
                model_id=model_id,
                timestamp=ts,
                failure_probability=prob,
                risk_level=_risk_from_probability(prob),
            )
        )

    # MOTOR_001: Recovery scenario (was critical, now recovering)
    motor_001_data = []
    for i in range(24):
        ts = now - timedelta(hours=24 - i)
        # Start high, decrease over time (maintenance performed)
        base_prob = 0.85 - (i / 24) * 0.55  # 0.85 -> 0.30
        noise = random.uniform(-0.05, 0.05)
        prob = max(0.1, min(0.9, base_prob + noise))
        motor_001_data.append((ts, prob))

    for ts, prob in motor_001_data:
        predictions_to_add.append(
            Prediction(
                asset_id="MOTOR_001",
                model_id=model_id,
                timestamp=ts,
                failure_probability=prob,
                risk_level=_risk_from_probability(prob),
            )
        )

    # Add all predictions to the database
    db.add_all(predictions_to_add)
    db.commit()

    return SeedResponse(
        message="Demo prediction history seeded successfully",
        predictions_added=len(predictions_to_add),
    )

