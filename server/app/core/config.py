from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


def _parse_bool(value: str | None, default: bool) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


@dataclass(frozen=True)
class Settings:
    """
    Minimal settings for the MVP.

    We intentionally avoid pydantic-settings to keep dependencies light.
    """

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./maintenance_predictor.db")
    STORE_TRAINING_DATA: bool = _parse_bool(os.getenv("STORE_TRAINING_DATA"), default=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()


