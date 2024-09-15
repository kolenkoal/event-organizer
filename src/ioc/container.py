from dishka import AsyncContainer, make_async_container

from src.ioc.providers.authentication import get_authentication_provider
from src.ioc.providers.database import get_database_provider
from src.ioc.providers.user import get_user_provider


def get_async_container() -> AsyncContainer:
    return make_async_container(get_authentication_provider(), get_database_provider(), get_user_provider())
