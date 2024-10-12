import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.dao import BaseDAO
from src.events.models import Event, EventParticipant
from src.events.schemas import ParticipantStatus


class EventDAO(BaseDAO):
    model = Event


class EventParticipantDAO(BaseDAO):
    model = EventParticipant

    @staticmethod
    async def cancel_participation(session: AsyncSession, user_id: uuid.UUID, event_id: uuid.UUID):
        query = select(EventParticipant).filter_by(user_id=user_id, event_id=event_id)
        result = await session.execute(query)
        participant = result.scalars().first()

        if participant:
            participant.status = ParticipantStatus.CANCELED
            await session.commit()
            await session.refresh(participant)

        return participant

    @classmethod
    async def get_participants_by_event(cls, session: AsyncSession, event_id: uuid.UUID):
        query = select(cls.model).filter_by(event_id=event_id)
        result = await session.execute(query)
        participants = result.scalars().all()
        return participants
