from fastapi import FastAPI
from app.api.api_v1 import api_router



app = FastAPI(title="AI Predictive Monitoring API")

app.include_router(api_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Hello World"}
