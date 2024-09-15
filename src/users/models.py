from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy import String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column

from src.models import Base


class User(Base, SQLAlchemyBaseUserTableUUID):  # type: ignore[misc]
    first_name: Mapped[str] = mapped_column(String(length=256), nullable=False)
    last_name: Mapped[str] = mapped_column(String(length=256), nullable=False)

    @classmethod
    def get_db(cls, session: AsyncSession) -> SQLAlchemyUserDatabase:
        return SQLAlchemyUserDatabase(session, User)
