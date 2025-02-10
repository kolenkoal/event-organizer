import datetime
import uuid

from pydantic import UUID4
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.dao import BaseDAO
from src.events.models import Event, EventParticipant
from src.events.schemas import ParticipantRole, ParticipantStatus
from src.users.models import User


class EventDAO(BaseDAO):
    model = Event

    @classmethod
    async def update_event_logo(cls, event: Event, logo_url: str, session: AsyncSession):
        event.logo_url = logo_url
        await session.commit()
        await session.refresh(event)
        return event

    @classmethod
    async def find_all_current_events(cls, session: AsyncSession):
        query = (
            select(cls.model)
            .options(selectinload(cls.model.sub_events))
            .where(cls.model.end_time > datetime.datetime.now(), cls.model.parent_event_id == None)
            .order_by(cls.model.title)
        )

        result = await session.execute(query)

        values = result.scalars().all()

        return values

    @classmethod
    async def find_user_events_organize(cls, session: AsyncSession, user_id: uuid.UUID):
        query = (
            select(cls.model)
            .options(selectinload(cls.model.sub_events))
            .where(
                cls.model.organizer_id == user_id,
                cls.model.end_time > datetime.datetime.now(),
                cls.model.parent_event_id == None,
            )
        )

        result = await session.execute(query)

        values = result.scalars().all()

        return values

    @staticmethod
    async def find_with_sub_events_by_id(session: AsyncSession, model_id: uuid.UUID):
        query = select(Event).options(selectinload(Event.sub_events)).filter_by(id=model_id)

        result = await session.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def delete_with_sub_events(session: AsyncSession, event: Event):
        for sub_event in event.sub_events:
            await session.delete(sub_event)

        await session.delete(event)

        await session.commit()


class EventParticipantDAO(BaseDAO):
    model = EventParticipant

    @staticmethod
    async def cancel_participation(session: AsyncSession, user_id: uuid.UUID, event_id: uuid.UUID):
        query = select(EventParticipant).filter_by(user_id=user_id, event_id=event_id)
        result = await session.execute(query)
        participant = result.scalars().first()

        if participant:
            await session.delete(participant)
            await session.commit()

        return participant

    @classmethod
    async def get_participants_by_event(cls, session: AsyncSession, event_id: uuid.UUID):
        query = select(cls.model).filter_by(event_id=event_id)
        result = await session.execute(query)
        participants = result.scalars().all()
        return participants

    @classmethod
    async def get_event_participants_by_role(cls, session: AsyncSession, event_id: uuid.UUID, role: ParticipantRole):
        query = select(cls.model).filter_by(event_id=event_id, role=role)
        result = await session.execute(query)
        participants = result.scalars().all()
        return participants

    @classmethod
    async def get_user_participated_events(cls, session: AsyncSession, user_id: uuid.UUID):
        query = (
            select(Event)
            .options(selectinload(Event.sub_events))
            .join(cls.model, Event.id == EventParticipant.event_id)
            .where(
                Event.parent_event_id == None,
                cls.model.user_id == user_id,
                Event.end_time > datetime.datetime.now(),
            )
        )
        result = await session.execute(query)
        events = result.scalars().all()
        return events

    @staticmethod
    async def get_participation_requests(
        session: AsyncSession, event_id: UUID4, status_filter: ParticipantStatus | None = None
    ):
        query = select(EventParticipant).filter(
            EventParticipant.event_id == event_id, EventParticipant.role == ParticipantRole.PARTICIPANT
        )

        if status_filter:
            query = query.filter(EventParticipant.status == status_filter)

        result = await session.execute(query)
        participants = result.scalars().all()

        return participants

    @staticmethod
    async def get_participation_requests_event(
        session: AsyncSession, event_id: UUID4, user_id: uuid.UUID, status_filter: ParticipantStatus | None = None
    ):
        query = select(EventParticipant).join(User, user_id == User.id).filter(EventParticipant.event_id == event_id)

        if status_filter:
            query = query.filter(EventParticipant.status == status_filter)

        result = await session.execute(query)
        participants = result.scalars().all()

        return participants

    @staticmethod
    async def update_participation_status(
        session: AsyncSession, event_id: UUID4, user_id: UUID4, status: ParticipantStatus
    ):
        participant_request = await session.execute(
            select(EventParticipant).filter(EventParticipant.event_id == event_id, EventParticipant.user_id == user_id)
        )
        participant_request = participant_request.scalar_one_or_none()

        if participant_request:
            participant_request.status = status
            await session.commit()
            await session.refresh(participant_request)
            return participant_request

        return None

    @staticmethod
    async def get_user_events(session: AsyncSession, user_id: uuid.UUID):
        query = (
            select(EventParticipant)
            .join(Event)
            .join(User, User.id == user_id)
            .filter(EventParticipant.user_id == user_id, Event.requires_participants == True)
        )
        result = await session.execute(query)
        return result.scalars().all()
