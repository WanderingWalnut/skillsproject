from __future__ import annotations

from io import StringIO
from typing import Iterable

import pandas as pd
from fastapi import UploadFile


REQUIRED_TRAIN_COLUMNS: tuple[str, ...] = (
    "timestamp",
    "asset_id",
    "temperature",
    "vibration",
    "pressure",
    "current",
    "label",
)


async def read_csv_upload(file: UploadFile) -> pd.DataFrame:
    """
    Read a CSV UploadFile into a DataFrame.

    MVP note: we decode UTF-8 and rely on pandas for CSV parsing.
    """
    filename = (file.filename or "").lower()
    if not filename.endswith(".csv"):
        raise ValueError("Please upload a .csv file")

    content = await file.read()
    try:
        text = content.decode("utf-8")
    except UnicodeDecodeError as e:
        raise ValueError("CSV is not UTF-8 encoded") from e

    try:
        return pd.read_csv(StringIO(text))
    except Exception as e:
        raise ValueError("Unable to parse CSV") from e


def validate_training_dataframe(df: pd.DataFrame, required_cols: Iterable[str] = REQUIRED_TRAIN_COLUMNS) -> pd.DataFrame:
    """
    Validate and coerce the training dataframe to expected types.

    Returns a cleaned DataFrame or raises ValueError with a user-facing message.
    """
    required_cols = tuple(required_cols)
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")

    out = df.loc[:, required_cols].copy()

    out["timestamp"] = pd.to_datetime(out["timestamp"], errors="coerce", utc=True)
    out["asset_id"] = out["asset_id"].astype(str)

    for col in ("temperature", "vibration", "pressure", "current"):
        out[col] = pd.to_numeric(out[col], errors="coerce")

    out["label"] = pd.to_numeric(out["label"], errors="coerce").astype("Int64")

    # Detect coercion failures
    bad_ts = int(out["timestamp"].isna().sum())
    bad_sensor = int(out[["temperature", "vibration", "pressure", "current"]].isna().any(axis=1).sum())
    bad_label = int(out["label"].isna().sum())

    if bad_ts or bad_sensor or bad_label:
        raise ValueError(
            "Invalid values detected after parsing. "
            f"bad_timestamp_rows={bad_ts}, bad_sensor_rows={bad_sensor}, bad_label_rows={bad_label}"
        )

    labels = out["label"].astype(int)
    if not labels.isin([0, 1]).all():
        raise ValueError("Label must be 0 or 1")
    out["label"] = labels

    return out


