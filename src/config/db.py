from pydantic import PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class DBSettings(BaseSettings):
    url: PostgresDsn
    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 50
    max_overflow: int = 10

    model_config = SettingsConfigDict(env_prefix="DB_")
