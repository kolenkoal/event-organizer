import uuid

from fastapi_users import FastAPIUsers

from src.auth.dependencies import auth_backend, get_user_manager
from src.users.models import User

fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)
