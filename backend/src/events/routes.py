import datetime
import uuid
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
    EventWithSubEventsResponse,
    ParticipantRole,
    ParticipantStatus,
)
from src.users.models import User
from src.users.schemas import AllEventsResponse, Event, EventWithSubEvents

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("/all", response_model=AllEventsResponse)
async def get_current_events(session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    find_all_current_events = await EventDAO.find_all_current_events(session)
    events = []

    for event in find_all_current_events:
        sub_events = []
        for sub_event in event.sub_events:
            sub_events.append(
                Event(
                    id=sub_event.id,
                    title=sub_event.title,
                    description=sub_event.description,
                    start_time=sub_event.start_time,
                    end_time=sub_event.end_time,
                    location=sub_event.location,
                )
            )

        events.append(
            EventWithSubEvents(
                id=event.id,
                title=event.title,
                description=event.description,
                start_time=event.start_time,
                end_time=event.end_time,
                location=event.location,
                sub_events=sub_events,
            )
        )

    return AllEventsResponse(events=events)


@router.get("/my/participate", response_model=AllEventsResponse)
async def get_current_participate_events(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)], user: User = Depends(current_user)
):
    participated_events = await EventParticipantDAO.get_user_participated_events(session, user.id)
    events = []

    for event in participated_events:
        sub_events = []
        for sub_event in event.sub_events:
            sub_events.append(
                Event(
                    id=sub_event.id,
                    title=sub_event.title,
                    description=sub_event.description,
                    start_time=sub_event.start_time,
                    end_time=sub_event.end_time,
                    location=sub_event.location,
                )
            )

        events.append(
            EventWithSubEvents(
                id=event.id,
                title=event.title,
                description=event.description,
                start_time=event.start_time,
                end_time=event.end_time,
                location=event.location,
                sub_events=sub_events,
            )
        )
    return AllEventsResponse(events=events)


@router.get("/my/organize", response_model=AllEventsResponse)
async def get_my_current_organize_events(
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)], user: User = Depends(current_user)
):
    find_all_current_events = await EventDAO.find_user_events_organize(session, user.id)
    events = []

    for event in find_all_current_events:
        sub_events = []
        for sub_event in event.sub_events:
            sub_events.append(
                Event(
                    id=sub_event.id,
                    title=sub_event.title,
                    description=sub_event.description,
                    start_time=sub_event.start_time,
                    end_time=sub_event.end_time,
                    location=sub_event.location,
                )
            )

        events.append(
            EventWithSubEvents(
                id=event.id,
                title=event.title,
                description=event.description,
                start_time=event.start_time,
                end_time=event.end_time,
                location=event.location,
                sub_events=sub_events,
            )
        )
    return AllEventsResponse(events=events)


@router.post("", response_model=EventResponse)
async def create_event(
    event_data: EventCreateRequest,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
    parent_event_id: uuid.UUID | None = None,
):
    """
    Создать основное мероприятие или подмероприятие.
    Если передан `parent_event_id`, создаётся подмероприятие.
    """
    now = datetime.datetime.now(datetime.timezone.utc)

    if event_data.end_time.tzinfo is None:
        event_data.end_time = event_data.end_time.replace(tzinfo=datetime.timezone.utc)

    if event_data.end_time <= now:
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail="The Event should be in the future")

    if event_data.end_time <= event_data.start_time:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="End datetime should be more than start datetime"
        )

    if parent_event_id:
        parent_event = await EventDAO.find_by_id(session=session, model_id=parent_event_id)
        if not parent_event:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parent event not found")

        if not (parent_event.start_time <= event_data.start_time < parent_event.end_time):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sub-event start time must be within the parent event time range",
            )
        if not (parent_event.start_time < event_data.end_time <= parent_event.end_time):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sub-event end time must be within the parent event time range",
            )

    new_event = await EventDAO.create(
        session=session,
        organizer_id=user.id,
        parent_event_id=parent_event_id,
        **event_data.model_dump(),
    )

    return new_event


@router.post("/{event_id}/register", response_model=EventParticipantResponse)
async def register_for_event(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
    request: EventParticipantCreate = None,
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    current_participation = await EventParticipantDAO.find_one_or_none(
        session=session, user_id=user.id, event_id=event.id
    )
    if current_participation:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You already registered!")

    now = datetime.datetime.now(datetime.timezone.utc)

    if event.end_time.tzinfo is None:
        event.end_time = event.end_time.replace(tzinfo=datetime.timezone.utc)

    if event.end_time <= now:
        raise HTTPException(status_code=status.HTTP_423_LOCKED, detail="The Event has ended")

    if event.requires_participants:
        if not request or not request.artifacts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Participation requires submitting artifacts.",
            )
        participation_data = EventParticipantCreate(
            user_id=user.id, event_id=event_id, status=ParticipantStatus.PENDING, artifacts=request.artifacts
        )
    else:
        participation_data = EventParticipantCreate(
            user_id=user.id, event_id=event_id, status=ParticipantStatus.APPROVED
        )

    participant = await EventParticipantDAO.create(session=session, **participation_data.model_dump())
    return participant


@router.get("/{event_id}", response_model=EventWithSubEventsResponse)
async def get_event_by_id(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
):
    """
    Получить мероприятие по ID вместе с его подмероприятиями.
    """
    event = await EventDAO.find_with_sub_events_by_id(session=session, model_id=event_id)

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
async def delete_event(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
):
    event = await EventDAO.find_with_sub_events_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    await EventDAO.delete_with_sub_events(session=session, event=event)


@router.patch("/{event_id}/cancel", status_code=status.HTTP_204_NO_CONTENT)
async def cancel_participation(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    await EventParticipantDAO.cancel_participation(session=session, user_id=user.id, event_id=event_id)
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
            {"user_id": participant.user_id, "registration_date": participant.created_at}
            for participant in participants
        ],
    )


@router.post("/{event_id}/request_participation", response_model=EventParticipantResponse)
async def request_participation(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
    role: ParticipantRole = ParticipantRole.PARTICIPANT,
    artifacts: list[str] | None = None,
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if event.requires_participants is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Event does not require participants")

    if event.organizer_id == user.id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You are an organizer of this event")

    current_event = await EventParticipantDAO.find_one_or_none(session=session, user_id=user.id, event_id=event.id)
    if current_event:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You already requested participation")

    event_participant_data = EventParticipantCreate(user_id=user.id, event_id=event_id, role=role, artifacts=artifacts)

    participant_request = await EventParticipantDAO.create(session=session, **event_participant_data.model_dump())
    return participant_request


@router.get("/{event_id}/participation_requests", response_model=list[EventParticipantResponse])
async def get_participation_requests(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
    status_filter: ParticipantStatus | None = None,
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if event.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the organizer of this event")

    participants = await EventParticipantDAO.get_participation_requests(
        session=session, event_id=event_id, status_filter=status_filter
    )
    return participants


@router.put("/{event_id}/participation_requests/{user_id}", response_model=EventParticipantResponse)
async def handle_participation_request(
    event_id: UUID4,
    user_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
    participant_status: ParticipantStatus = ParticipantStatus.APPROVED,
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if event.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the organizer of this event")

    participant_request = await EventParticipantDAO.update_participation_status(
        session=session, event_id=event_id, user_id=user_id, status=participant_status
    )

    if not participant_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Participation request not found")

    return participant_request


@router.get("/{event_id}/my-participation-requests", response_model=list[EventParticipantResponse])
async def get_user_participation_requests(
    event_id: uuid.UUID,
    session: AsyncSession = Depends(db_helper.session_getter),
    user: User = Depends(current_user),
    status_filter: ParticipantStatus | None = None,
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    participation_requests = await EventParticipantDAO.get_participation_requests(
        session=session, event_id=event_id, status_filter=status_filter
    )

    user_requests = [request for request in participation_requests if request.user_id == user.id]

    if not user_requests:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No participation requests found for this user"
        )

    return user_requests


@router.get("/users/my/events-participation", response_model=list[EventParticipantResponse])
async def get_user_events(
    session: AsyncSession = Depends(db_helper.session_getter), user: User = Depends(current_user)
):
    return await EventParticipantDAO.get_user_events(session=session, user_id=user.id)
