import uuid
from typing import Annotated, AsyncGenerator

from dishka import FromComponent, Provider, Scope, provide
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import AuthenticationBackend
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas import Component
from src.users.models import User
from users.manager import UserManager


class UserProvider(Provider):
    scope = Scope.APP
    component = Component.COMMON

    @provide()
    async def get_user_db(
        self, session: Annotated[AsyncSession, FromComponent(Component.COMMON)]
    ) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
        yield User.get_db(session)

    @provide()
    async def get_user_manager(self, users_db: SQLAlchemyUserDatabase) -> AsyncGenerator[UserManager, None]:
        yield UserManager(users_db)

    @provide()
    async def get_fastapi_users(self, auth_backend: Annotated[AuthenticationBackend, FromComponent(Component.COMMON)]) -> FastAPIUsers[User, uuid.UUID]:
        return FastAPIUsers[User, uuid.UUID](
            self.get_user_manager,
            [auth_backend],
        )


def get_user_provider() -> Provider:
    return UserProvider()
