from __future__ import annotations

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, func

from app.core.db.dp import Base


class Prediction(Base):
    __tablename__ = "prediction"

    id = Column(Integer, primary_key=True, index=True)

    asset_id = Column(String, index=True, nullable=False)
    risk_level = Column(String, nullable=False)
    failure_probability = Column(Float, nullable=False)

    # Timestamp of the sensor row used for this assessment (from CSV).
    timestamp = Column(DateTime, nullable=False)

    # Link prediction to the model used (public model_id, consistent with TrainingData).
    model_id = Column(
        String,
        ForeignKey("model_metadata.model_id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    created_at = Column(DateTime, nullable=False, server_default=func.now())


