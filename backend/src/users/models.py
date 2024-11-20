from typing import Self
from uuid import UUID

from fastapi_users.models import UserProtocol
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID, SQLAlchemyUserDatabase
from sqlalchemy import String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import Base


class User(Base, SQLAlchemyBaseUserTableUUID):  # type: ignore[misc]
    first_name: Mapped[str] = mapped_column(String(length=256), nullable=True)
    last_name: Mapped[str] = mapped_column(String(length=256), nullable=True)
    external_id: Mapped[int] = mapped_column(nullable=True)

    events: Mapped[list["Event"]] = relationship("Event", back_populates="organizer", lazy="selectin")  # noqa

    participated_events = relationship("EventParticipant", back_populates="user", lazy="selectin")

    @classmethod
    def get_db(cls, session: AsyncSession) -> SQLAlchemyUserDatabase[UserProtocol[UUID], Self]:
        return SQLAlchemyUserDatabase(session, cls)
