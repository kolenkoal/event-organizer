from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.auth.routes import auth_router
from src.events.feautures.routes import router as event_features_router
from src.events.routes import router as event_router
from src.users.bearer import http_bearer
from src.users.routes import users_router


def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    router = APIRouter(prefix="/api/v1", dependencies=[Depends(http_bearer)])
    router.include_router(auth_router)
    router.include_router(users_router)
    router.include_router(event_router)
    router.include_router(event_features_router)

    app.include_router(router)

    return app
