from typing import Annotated, AsyncGenerator

from dishka import FromComponent, Provider, Scope, provide
from fastapi_users.authentication import AuthenticationBackend, BearerTransport
from fastapi_users.authentication.strategy.db import DatabaseStrategy
from fastapi_users_db_sqlalchemy.access_token import SQLAlchemyAccessTokenDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.models import AccessToken
from src.config.authentication import AuthenticationSettings
from src.schemas import Component


class Config:
    def __init__(self, authentication_settings: AuthenticationSettings) -> None:
        self.authentication_settings = authentication_settings


class AuthenticationProvider(Provider):
    scope = Scope.APP
    component = Component.COMMON

    def __init__(self, config: Config):
        super().__init__()
        self._config = config

    @provide()
    async def get_access_token_db(
        self, session: Annotated[AsyncSession, FromComponent(Component.COMMON)]
    ) -> AsyncGenerator[SQLAlchemyAccessTokenDatabase, None]:
        yield AccessToken.get_db(session=session)

    @provide()
    def get_database_strategy(self, access_token_db: SQLAlchemyAccessTokenDatabase[AccessToken]) -> DatabaseStrategy:
        return DatabaseStrategy(access_token_db, lifetime_seconds=self._config.authentication_settings.lifetime_seconds)

    @provide()
    def get_bearer_transport(self) -> BearerTransport:
        return BearerTransport(tokenUrl="auth/jwt/token")  # TODO: update URL

    @provide()
    def get_auth_backend(self, bearer_transport: BearerTransport) -> AuthenticationBackend:
        return AuthenticationBackend(
            name="access-tokens-db",
            transport=bearer_transport,
            get_strategy=self.get_database_strategy,  # TODO: проверить, что все ок
        )


def get_authentication_provider() -> Provider:
    return AuthenticationProvider(Config(AuthenticationSettings()))
