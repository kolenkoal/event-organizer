import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.db_helper import db_helper
from src.auth.fastapi_users import current_user
from src.events.dao import EventDAO, EventParticipantDAO
from src.events.schemas import (
    EventCreateRequest,
    EventParticipantCreate,
    EventParticipantResponse,
    EventParticipantsResponse,
    EventResponse,
    EventUpdateRequest,
)
from src.users.models import User
from src.users.schemas import AllEventsResponse, Event

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("/all", response_model=AllEventsResponse)
async def get_current_events(session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    find_all_current_events = await EventDAO.find_all_current_events(session)
    events = [
        Event(
            title=event.title,
            description=event.description,
            start_time=event.start_time,
            end_time=event.end_time,
            location=event.location,
        )
        for event in find_all_current_events
    ]
    return AllEventsResponse(events=events)


@router.get("/my/participate", response_model=AllEventsResponse)
async def get_current_participate_events(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)], user: User = Depends(current_user)
):
    participated_events = await EventParticipantDAO.get_user_participated_events(session, user.id)
    events = [
        Event(
            title=event.title,
            description=event.description,
            start_time=event.start_time,
            end_time=event.end_time,
            location=event.location,
        )
        for event in participated_events
    ]
    return AllEventsResponse(events=events)


@router.get("/my/organize", response_model=AllEventsResponse)
async def get_my_current_organize_events(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)], user: User = Depends(current_user)
):
    find_all_current_events = await EventDAO.find_user_events_organize(session, user.id)
    events = [
        Event(
            title=event.title,
            description=event.description,
            start_time=event.start_time,
            end_time=event.end_time,
            location=event.location,
        )
        for event in find_all_current_events
    ]
    return AllEventsResponse(events=events)


@router.post("", response_model=EventResponse)
async def create_event(
    event_data: EventCreateRequest,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
):
    now = datetime.datetime.now(datetime.timezone.utc)

    if event_data.end_time.tzinfo is None:
        event_data.end_time = event_data.end_time.replace(tzinfo=datetime.timezone.utc)

    if event_data.end_time <= now:
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail="The Event should be in the future")

    if event_data.end_time <= event_data.start_time:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="End datetime should me more than start datetime"
        )

    new_event = await EventDAO.create(session=session, organizer_id=user.id, **event_data.model_dump())

    return new_event


@router.post("/{event_id}/register", response_model=EventParticipantResponse)
async def register_for_event(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    current_event = await EventParticipantDAO.find_one_or_none(session=session, user_id=user.id, event_id=event.id)

    if current_event:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You already registered!")

    now = datetime.datetime.now(datetime.timezone.utc)

    if event.end_time.tzinfo is None:
        event.end_time = event.end_time.replace(tzinfo=datetime.timezone.utc)

    if event.end_time <= now:
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail="The Event has ended")

    event_participant_data = EventParticipantCreate(user_id=user.id, event_id=event_id)
    participant = await EventParticipantDAO.create(session=session, **event_participant_data.model_dump())

    return participant


@router.get("/{event_id}", response_model=EventResponse)
async def get_event_by_id(event_id: UUID4, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)

    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    return event


@router.patch("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: UUID4, event_data: EventUpdateRequest, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    updated_event = await EventDAO.update_data(session=session, model_id=event_id, data=event_data)
    if not updated_event:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to update event")

    return updated_event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: UUID4, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    await EventDAO.delete_certain_item(session=session, model_id=event_id)


@router.patch("/{event_id}/cancel", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_participation(
    event_id: UUID4, user_id: UUID4, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    await EventParticipantDAO.cancel_participation(session=session, user_id=user_id, event_id=event_id)
    return None


@router.get("/{event_id}/participants", response_model=EventParticipantsResponse)
async def get_event_participants(event_id: UUID4, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    participants = await EventParticipantDAO.get_participants_by_event(session=session, event_id=event_id)

    return EventParticipantsResponse(
        event_id=event_id,
        participants=[
            {"user_id": participant.user_id, "registration_date": participant.created_at, "status": participant.status}
            for participant in participants
        ],
    )
