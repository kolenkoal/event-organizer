from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthenticationSettings(BaseSettings):
    lifetime_seconds: int = 3600
    reset_password_token_secret: str = "123"
    verification_token_secret: str = "123"

    model_config = SettingsConfigDict(env_prefix="AUTHENTICATION_")

