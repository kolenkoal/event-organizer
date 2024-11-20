import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.dao import BaseDAO
from src.events.models import Event, EventParticipant
from src.users.models import User


class UserDAO(BaseDAO):
    model = User

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
