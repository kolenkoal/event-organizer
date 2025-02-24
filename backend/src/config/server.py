from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class ServerSettings(BaseSettings):
    workers: int = 1
    reload: bool = False
    loop: Literal["none", "auto", "asyncio", "uvloop"] = "asyncio"
    host: str = "0.0.0.0"
    port: int = 8080
    backlog: int = 2048

    model_config = SettingsConfigDict(env_prefix="SERVER_", strict=False)
