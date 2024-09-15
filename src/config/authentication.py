from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthenticationSettings(BaseSettings):
    lifetime_seconds: int = 3600
    model_config = SettingsConfigDict(env_prefix="AUTHENTICATION_")
