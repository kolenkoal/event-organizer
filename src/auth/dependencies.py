from typing import Annotated, AsyncGenerator

from fastapi import Depends
from fastapi_users.authentication import AuthenticationBackend, BearerTransport
from fastapi_users.authentication.strategy.db import AccessTokenDatabase, DatabaseStrategy
from fastapi_users.db import SQLAlchemyUserDatabase
from fastapi_users_db_sqlalchemy.access_token import SQLAlchemyAccessTokenDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.db_helper import db_helper
from src.auth.models import AccessToken
from src.config.authentication import AuthenticationSettings
from src.users.manager import UserManager
from src.users.models import User


async def get_access_token_db(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> AsyncGenerator[SQLAlchemyAccessTokenDatabase, None]:
    yield AccessToken.get_db(session=session)


async def get_user_db(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
) -> AsyncGenerator[SQLAlchemyUserDatabase, None]:
    yield User.get_db(session)


def get_database_strategy(
    access_token_db: Annotated[
        AccessTokenDatabase[AccessToken],
        Depends(get_access_token_db),
    ],
) -> DatabaseStrategy:
    return DatabaseStrategy(database=access_token_db, lifetime_seconds=AuthenticationSettings().lifetime_seconds)


def get_bearer_transport() -> BearerTransport:
    return BearerTransport(tokenUrl="api/v1/auth/login")


async def get_user_manager(
    users_db: Annotated[SQLAlchemyUserDatabase, Depends(get_user_db)],
) -> AsyncGenerator[UserManager, None]:
    yield UserManager(users_db)


auth_backend = AuthenticationBackend(
    name="access-tokens-db", transport=get_bearer_transport(), get_strategy=get_database_strategy
)
