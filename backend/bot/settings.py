from pydantic_settings import BaseSettings, SettingsConfigDict


class TelegramBotSettings(BaseSettings):
    token: str
    events_url: str = "http://127.0.0.1:8080/api/v1/events"
    auth_url: str = "http://127.0.0.1:8080/api/v1/auth"
    users_url: str = "http://127.0.0.1:8080/api/v1/users"

    model_config = SettingsConfigDict(env_prefix="TELEGRAM_BOT_", strict=False)
