import boto3
from botocore.exceptions import BotoCoreError, ClientError
from fastapi import UploadFile

from src.s3.settings import S3Settings


class S3Manager:
    def __init__(self, settings: S3Settings):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.access_key,
            aws_secret_access_key=settings.secret_key,
            endpoint_url=settings.endpoint_url,
            region_name=settings.region,
        )
        self._bucket_name = settings.bucket_name

    def upload_file(self, upload_file: UploadFile, key: str) -> str:
        """
        Загружает файл в указанный ключ (key) внутри бакета.
        Возвращает итоговый URL (если бакет public-read)
        или "приватную" ссылку, которую можно использовать
        вместе с presigned_url.
        """
        try:
            self.s3_client.upload_fileobj(upload_file.file, self._bucket_name, key)
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Ошибка при загрузке файла в S3: {e}")

        return f"{self.s3_client.meta.endpoint_url}/{self._bucket_name}/{key}"

    def generate_presigned_url(self, key: str, expires_in: int = 3600) -> str:
        """
        Генерация временной (подписанной) ссылки для скачивания объекта.
        """
        try:
            url = self.s3_client.generate_presigned_url(
                ClientMethod="get_object", Params={"Bucket": self._bucket_name, "Key": key}, ExpiresIn=expires_in
            )
            return url
        except (BotoCoreError, ClientError) as e:
            raise RuntimeError(f"Ошибка при генерации presigned URL: {e}")


s3_manager = S3Manager(S3Settings())
