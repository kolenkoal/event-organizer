from typing import Annotated, AsyncGenerator

from dishka import FromComponent, Provider, Scope, provide
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
    async def get_user_manager(self, users_db: SQLAlchemyUserDatabase) -> UserManager:
        yield UserManager(users_db)


def get_user_provider() -> Provider:
    return UserProvider()
