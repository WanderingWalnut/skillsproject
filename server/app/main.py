from fastapi import FastAPI
from app.api.api_v1 import api_router
from fastapi.middleware.cors import CORSMiddleware




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

@app.get("/")
async def root():
    return {"message": "Hello World"}
