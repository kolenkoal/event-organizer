from dishka import AsyncContainer, make_async_container

from src.ioc.providers.database import get_database_provider


def get_async_container() -> AsyncContainer:
    return make_async_container(get_database_provider())
