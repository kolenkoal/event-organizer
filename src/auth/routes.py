from fastapi import APIRouter

from src.auth.dependencies import auth_backend
from src.auth.fastapi_users import fastapi_users
from src.users.schemas import UserCreate, UserRead

auth_router = APIRouter(prefix="/auth")

auth_router.include_router(router=fastapi_users.get_auth_router(auth_backend))
auth_router.include_router(router=fastapi_users.get_register_router(UserRead, UserCreate))
