from fastapi import APIRouter

from src.auth.fastapi_users import fastapi_users
from src.users.schemas import UserRead, UserUpdate

users_router = APIRouter(prefix="/users")
users_router.include_router(router=fastapi_users.get_users_router(UserRead, UserUpdate))
