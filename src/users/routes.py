import uuid
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.db_helper import db_helper
from src.auth.fastapi_users import fastapi_users
from src.users.dao import UserDAO
from src.users.schemas import (
    OrganizedEventResponse,
    ParticipatedEventResponse,
    UserEventsResponse,
    UserRead,
    UserUpdate,
)

users_router = APIRouter(prefix="/users")
users_router.include_router(router=fastapi_users.get_users_router(UserRead, UserUpdate))


@users_router.get("/{user_id}/events", response_model=UserEventsResponse)
async def get_user_events(user_id: uuid.UUID, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    organized_events = await UserDAO.get_organized_events(session=session, user_id=user_id)

    participated_events = await UserDAO.get_participated_events(session=session, user_id=user_id)

    organized_events_response = [
        OrganizedEventResponse(id=event.id, title=event.title, start_time=event.start_time)
        for event in organized_events
    ]

    participated_events_response = [
        ParticipatedEventResponse(
            id=participant.event_id,
            title=participant.event.title,
            start_time=participant.event.start_time,
            status=participant.status.value,
        )
        for participant in participated_events
    ]

    return UserEventsResponse(
        organized_events=organized_events_response, participated_events=participated_events_response
    )
