import datetime
import uuid

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.dao import BaseDAO
from src.events.models import Event, EventParticipant
from src.events.schemas import ParticipantStatus


class EventDAO(BaseDAO):
    model = Event

    @classmethod
    async def find_all_current_events(cls, session: AsyncSession):
        query = select(cls.model).where(cls.model.end_time > datetime.datetime.now()).order_by(cls.model.title)

        result = await session.execute(query)

        values = result.scalars().all()

        return values

    @classmethod
    async def find_user_events_organize(cls, session: AsyncSession, user_id: uuid.UUID):
        query = select(cls.model).where(cls.model.organizer_id == user_id, cls.model.end_time > datetime.datetime.now())

        result = await session.execute(query)

        values = result.scalars().all()

        return values


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

    @classmethod
    async def get_user_participated_events(cls, session: AsyncSession, user_id: uuid.UUID):
        query = (
            select(Event)
            .join(cls.model, Event.id == EventParticipant.event_id)
            .where(
                cls.model.user_id == user_id,
                Event.end_time > datetime.datetime.now(),
                or_(cls.model.status == ParticipantStatus.REGISTERED, cls.model.status == ParticipantStatus.ATTENDED),
            )
        )
        result = await session.execute(query)
        events = result.scalars().all()
        return events
