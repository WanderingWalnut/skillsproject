from fastapi import APIRouter
from app.api.api_v1.routes import assets, predict, train, upload

api_router = APIRouter()

api_router.include_router(assets.router)
api_router.include_router(predict.router)
api_router.include_router(train.router)
api_router.include_router(upload.router)

