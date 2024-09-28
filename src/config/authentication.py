from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthenticationSettings(BaseSettings):
    lifetime_seconds: int = 3600
    reset_password_token_secret: str
    verification_token_secret: str

    model_config = SettingsConfigDict(env_prefix="AUTHENTICATION_")
