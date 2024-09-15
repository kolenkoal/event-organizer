from typing import Annotated, AsyncGenerator

from dishka import FromComponent, Provider, Scope, provide
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from src.schemas import Component
from src.users.models import User


class UserProvider(Provider):
    scope = Scope.APP
    component = Component.COMMON

    @provide()
    async def get_user_db(
        self, session: Annotated[AsyncSession, FromComponent(Component.COMMON)]
    ) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
        yield User.get_db(session)


def get_user_provider() -> Provider:
    return UserProvider()
