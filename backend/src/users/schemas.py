import uuid

from fastapi_users.schemas import BaseUser, BaseUserCreate, BaseUserUpdate
from pydantic import Field


class UserRead(BaseUser[uuid.UUID]):
    first_name: str
    last_name: str


class UserCreate(BaseUserCreate):
    first_name: str = Field(max_length=256)
    last_name: str = Field(max_length=256)


class UserUpdate(BaseUserUpdate):
    first_name: str | None = Field(None, max_length=256)
    last_name: str | None = Field(None, max_length=256)
