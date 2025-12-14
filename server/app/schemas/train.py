from typing import Optional

from pydantic import ConfigDict

from pydantic import BaseModel, Field


class TrainResponse(BaseModel):
    """
    Response returned after a successful training run.

    Keep this stable for the frontend: it will drive the Dashboard workflow UI.
    """

    # Pydantic v2 warns about `model_*` fields by default; allow them for this API contract.
    model_config = ConfigDict(protected_namespaces=())

    model_id: str = Field(..., description="Unique identifier for the trained model artifact")
    rows_used: int = Field(..., ge=0, description="Number of rows used for training")
    assets: int = Field(..., ge=0, description="Number of unique assets in the training dataset")
    positive_rate: float = Field(..., ge=0.0, le=1.0, description="Share of label==1 rows")
    metrics: dict[str, float] = Field(default_factory=dict, description="Training/validation metrics")
    # Python 3.9 compatibility: use Optional instead of `str | None`.
    model_path: Optional[str] = Field(
        default=None, description="Filesystem path where the model artifact was saved"
    )


