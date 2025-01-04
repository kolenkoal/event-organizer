from pydantic_settings import BaseSettings, SettingsConfigDict


class S3Settings(BaseSettings):
    endpoint_url: str = "https://storage.yandexcloud.net"
    region: str = "ru-central1"
    access_key: str
    secret_key: str
    bucket_name: str = "test-bucket-event-organizer"

    model_config = SettingsConfigDict(env_prefix="S3_")
