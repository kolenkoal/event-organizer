from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.auth.routes import auth_router
from src.events.routes import router as event_router
from src.events.routes import router_v2 as event_router_v2
from src.users.bearer import http_bearer
from src.users.routes import users_router

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://127.0.0.1:3000",
    "http://test",
]


def create_app() -> FastAPI:
    app = FastAPI()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    router = APIRouter(prefix="/api/v1", dependencies=[Depends(http_bearer)])
    router.include_router(auth_router)
    router.include_router(users_router)
    router.include_router(event_router)

    router_v2 = APIRouter(prefix="/api/v2", dependencies=[Depends(http_bearer)])
    router_v2.include_router(event_router_v2)

    app.include_router(router)
    app.include_router(router_v2)

    return app
