from dishka.integrations.fastapi import setup_dishka
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.auth.routes import auth_router
from src.ioc.container import get_async_container


def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    dishka_container = get_async_container()
    setup_dishka(dishka_container, app)

    router = APIRouter(prefix="/api/v1")
    router.include_router(auth_router)

    app.include_router(router)

    return app
