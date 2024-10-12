import uuid

from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import load_only

from src.dao import BaseDAO
from src.events.models import Event, EventParticipant
from src.users.models import User


class UserDAO(BaseDAO):
    model = User

    @classmethod
    async def check_organizer_exists(cls, organizer_id: UUID4, session: AsyncSession) -> bool:
        query = select(cls.model).options(load_only(User.id)).where(cls.model.id == organizer_id)

        result = await session.execute(query)
        return result.scalar_one_or_none() is not None

    @staticmethod
    async def get_organized_events(session: AsyncSession, user_id: uuid.UUID):
        query = select(Event).filter_by(organizer_id=user_id)
        result = await session.execute(query)
        return result.scalars().all()

    @staticmethod
    async def get_participated_events(session: AsyncSession, user_id: uuid.UUID):
        query = select(EventParticipant).filter_by(user_id=user_id)
        result = await session.execute(query)
        return result.scalars().all()
