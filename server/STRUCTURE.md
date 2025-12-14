# Backend Structure

This document explains the backend folder structure, following the FastAPI full-stack template organization.

## Structure Overview

```
server/
├── app/                    # Main application package
│   ├── __init__.py
│   ├── main.py            # FastAPI application entry point
│   │
│   ├── api/               # API layer
│   │   ├── __init__.py
│   │   ├── deps.py        # Dependency injection (dependencies for routes)
│   │   └── api_v1/        # API version 1
│   │       ├── __init__.py
│   │       └── endpoints/ # Route handlers
│   │           ├── __init__.py
│   │           ├── upload.py    # POST /upload
│   │           ├── train.py     # POST /train
│   │           ├── predict.py   # POST /predict
│   │           └── assets.py    # GET /assets, GET /assets/{id}
│   │
│   ├── core/              # Core configuration and utilities
│   │   ├── __init__.py
│   │   ├── config.py     # Application settings (from environment)
│   │   └── security.py    # Security utilities (if needed later)
│   │
│   ├── crud/              # Database operations (CRUD)
│   │   ├── __init__.py
│   │   └── base.py        # Base CRUD operations (if using DB)
│   │
│   ├── models/            # Database models (SQLModel/Pydantic)
│   │   ├── __init__.py
│   │   ├── asset.py       # Asset model
│   │   └── prediction.py  # Prediction model
│   │
│   └── schemas/           # Pydantic schemas for request/response validation
│       ├── __init__.py
│       ├── asset.py       # Asset schemas
│       ├── upload.py      # Upload request schemas
│       ├── train.py       # Training request schemas
│       └── prediction.py  # Prediction schemas
│
└── requirements.txt       # Python dependencies
```

## Folder Responsibilities

### `app/main.py`
FastAPI application instance, middleware setup, and route registration.

### `app/api/`
Contains all API route definitions and dependency injection.

- **`deps.py`**: Common dependencies used across routes (e.g., database session, current user if auth is added later)
- **`api_v1/endpoints/`**: Individual route handler files
  - `upload.py`: Handle CSV file uploads
  - `train.py`: Handle model training requests
  - `predict.py`: Handle risk prediction requests
  - `assets.py`: Handle asset listing and detail requests

### `app/core/`
Core application configuration and utilities.

- **`config.py`**: Settings loaded from environment variables (API keys, model paths, etc.)
- **`security.py`**: Security utilities (password hashing, token generation - if needed later)

### `app/crud/`
Database CRUD operations (if using a database). For MVP, might be minimal or skipped if using file-based storage.

### `app/models/`
Database models using SQLModel or Pydantic. Defines the data structure for assets, predictions, etc.

### `app/schemas/`
Pydantic schemas for:
- Request validation (what the API expects)
- Response models (what the API returns)
- Data transformation between API and internal models

## Import Patterns

- ✅ Endpoints import from `schemas`, `crud`, `models`, `core`
- ✅ CRUD operations import from `models` and `schemas`
- ✅ Core utilities are imported by all layers
- ❌ Avoid circular dependencies
- ❌ Models should not import from API layer

## MVP Adaptations

Since this is an MVP:
- **No database yet**: `crud/` and `models/` might be minimal or use in-memory/file storage
- **No authentication**: `security.py` can be minimal or empty
- **Simple file handling**: Upload endpoint handles CSV directly
- **ML model storage**: Models saved to disk, loaded when needed

This structure allows easy extension when adding:
- Database (PostgreSQL)
- Authentication
- More complex ML pipelines
- Background tasks

