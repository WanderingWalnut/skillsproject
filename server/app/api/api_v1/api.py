from fastapi import APIRouter
from app.api.api_v1.routes import assets, predict, seed, train

api_router = APIRouter(prefix="/v1")

api_router.include_router(assets.router)
api_router.include_router(predict.router)
api_router.include_router(seed.router)
api_router.include_router(train.router)

