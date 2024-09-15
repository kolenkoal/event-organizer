from typing import AsyncGenerator

from dishka import Provider, Scope, provide
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, async_sessionmaker, create_async_engine

from src.config.database import DatabaseSettings
from src.schemas import Component


class Config:
    def __init__(self, database_settings: DatabaseSettings) -> None:
        self._database_settings = database_settings
        self.engine: AsyncEngine = create_async_engine(
            url=str(self._database_settings.url),
            echo=self._database_settings.echo,
            echo_pool=self._database_settings.echo_pool,
            pool_size=self._database_settings.pool_size,
            max_overflow=self._database_settings.max_overflow,
        )
        self.session_factory: async_sessionmaker[AsyncSession] = async_sessionmaker(
            bind=self.engine,
            autoflush=False,
            autocommit=False,
            expire_on_commit=False,
        )


class DatabaseProvider(Provider):
    scope = Scope.APP
    component = Component.COMMON

    def __init__(self, config: Config):
        super().__init__()
        self._config = config

    @provide()
    async def session_getter(self) -> AsyncGenerator[AsyncSession, None]:
        async with self._config.session_factory() as session:
            yield session


def get_database_provider() -> Provider:
    return DatabaseProvider(Config(DatabaseSettings()))
