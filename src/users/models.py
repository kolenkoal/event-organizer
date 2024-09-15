from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.models import Base


class User(Base, SQLAlchemyBaseUserTableUUID):  # type: ignore[misc]
    first_name: Mapped[str] = mapped_column(String(length=256), nullable=False)
    last_name: Mapped[str] = mapped_column(String(length=256), nullable=False)
