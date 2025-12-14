from fastapi import FastAPI
from app.api.api_v1 import api_router
from fastapi.middleware.cors import CORSMiddleware

from app.core.db.dp import Base, engine
from app.models import ModelMetadata, TrainingData  # noqa: F401



app = FastAPI(title="AI Predictive Monitoring API")

app.include_router(api_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://localhost:5173/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.on_event("startup")
def _init_db() -> None:
    # Ensure all model tables are created for the MVP (SQLite file DB).
    Base.metadata.create_all(bind=engine)


@app.get("/")
async def root():
    return {"message": "Hello World"}
