import datetime
import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.db_helper import db_helper
from src.auth.fastapi_users import current_user
from src.events.dao import EventDAO, EventParticipantDAO
from src.events.schemas import (
    AllEventsResponse,
    EventCreateRequest,
    EventListenersResponse,
    EventParticipantCreate,
    EventParticipantResponse,
    EventParticipantsResponse,
    EventResponse,
    EventUpdateRequest,
    EventWithSubEvents,
    EventWithSubEventsResponse,
    ParticipantRole,
    ParticipantStatus,
)
from src.s3.manager import s3_manager
from src.users.models import User

router = APIRouter(prefix="/events", tags=["Events"])
router_v2 = APIRouter(prefix="/events", tags=["EventsV2"])


ALLOWED_MIME_TYPES = {
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
}


@router.get("/all", response_model=AllEventsResponse)
async def get_current_events(session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    find_all_current_events = await EventDAO.find_all_current_events(session)
    events = []

    for event in find_all_current_events:
        sub_events = []
        for sub_event in event.sub_events:
            sub_events.append(
                EventResponse(
                    id=sub_event.id,
                    title=sub_event.title,
                    description=sub_event.description,
                    start_time=sub_event.start_time,
                    end_time=sub_event.end_time,
                    location=sub_event.location,
                    logo_url=sub_event.logo_url,
                    organizer_id=sub_event.organizer_id,
                    created_at=sub_event.created_at,
                    parent_event_id=sub_event.parent_event_id,
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
                logo_url=event.logo_url,
                organizer_id=event.organizer_id,
                created_at=event.created_at,
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
                EventResponse(
                    id=sub_event.id,
                    title=sub_event.title,
                    description=sub_event.description,
                    start_time=sub_event.start_time,
                    end_time=sub_event.end_time,
                    location=sub_event.location,
                    logo_url=sub_event.logo_url,
                    organizer_id=sub_event.organizer_id,
                    created_at=sub_event.created_at,
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
                logo_url=event.logo_url,
                organizer_id=event.organizer_id,
                created_at=event.created_at,
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
                EventResponse(
                    id=sub_event.id,
                    title=sub_event.title,
                    description=sub_event.description,
                    start_time=sub_event.start_time,
                    end_time=sub_event.end_time,
                    location=sub_event.location,
                    logo_url=sub_event.logo_url,
                    organizer_id=sub_event.organizer_id,
                    created_at=sub_event.created_at,
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
                logo_url=event.logo_url,
                organizer_id=event.organizer_id,
                created_at=event.created_at,
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

        if parent_event.organizer_id != user.id:
            raise HTTPException(status_code=status.HTTP_423_LOCKED, detail="You are not an organizer of parent event")

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


@router.patch("/{event_id}/logo", response_model=EventResponse)
async def update_event_logo(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    logo: UploadFile = File(...),
    user: User = Depends(current_user),
):
    """
    Загрузить или обновить логотип мероприятия.
    """
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if event.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You are not the organizer of this event")

    if logo.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type for logo: {logo.content_type}. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}",
        )

    logo_key = f"events/{event_id}/logo/{uuid.uuid4()}_{logo.filename}"
    try:
        logo_url = s3_manager.upload_file(logo, logo_key)
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload logo: {e}",
        )

    return await EventDAO.update_event_logo(event, logo_url, session)


@router.post("/{event_id}/register", response_model=EventParticipantResponse)
async def register_for_event(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
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

    participation_data = EventParticipantCreate(user_id=user.id, event_id=event_id, status=ParticipantStatus.APPROVED)

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
            {"user_id": participant.user_id, "registration_date": participant.created_at, "user": participant.user}
            for participant in participants
        ],
    )


@router_v2.get("/{event_id}/listeners", response_model=EventListenersResponse)
async def get_event_listeners(event_id: UUID4, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    participants = await EventParticipantDAO.get_event_participants_by_role(
        session=session, event_id=event_id, role=ParticipantRole.LISTENER
    )

    return EventListenersResponse(
        event_id=event_id,
        listeners=[
            {"user_id": participant.user_id, "registration_date": participant.created_at, "user": participant.user}
            for participant in participants
        ],
    )


@router_v2.get("/{event_id}/participants", response_model=EventParticipantsResponse)
async def get_event_participants_v2(
    event_id: UUID4, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    participants = await EventParticipantDAO.get_event_participants_by_role(
        session=session, event_id=event_id, role=ParticipantRole.PARTICIPANT
    )

    return EventParticipantsResponse(
        event_id=event_id,
        participants=[
            {"user_id": participant.user_id, "registration_date": participant.created_at, "user": participant.user}
            for participant in participants
        ],
    )


@router.post("/{event_id}/request_participation", response_model=EventParticipantResponse)
async def request_participation(
    event_id: UUID4,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
    user: User = Depends(current_user),
    artifacts: list[UploadFile] | None = None,
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if not event.requires_participants:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Event does not require participants")

    if event.organizer_id == user.id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You are an organizer of this event")

    current_event = await EventParticipantDAO.find_one_or_none(session=session, user_id=user.id, event_id=event.id)
    if current_event:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You already requested participation")

    artifact_urls = []

    if artifacts:
        for artifact in artifacts:
            if artifact.content_type not in ALLOWED_MIME_TYPES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Unsupported file type: {artifact.content_type}. Allowed types: {', '.join(ALLOWED_MIME_TYPES)}",
                )

            key = f"events/{event_id}/users/{user.id}/{artifact.filename}"
            try:
                file_url = s3_manager.upload_file(artifact, key)
                artifact_urls.append(file_url)
            except RuntimeError as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to upload artifact: {e}",
                )

    event_participant_data = EventParticipantCreate(
        user_id=user.id, event_id=event_id, role=ParticipantRole.PARTICIPANT, artifacts=artifact_urls
    )

    return await EventParticipantDAO.create(session=session, **event_participant_data.model_dump())


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
        return []

    return user_requests


@router.get("/users/my/events-participation", response_model=list[EventParticipantResponse])
async def get_user_events(
    session: AsyncSession = Depends(db_helper.session_getter), user: User = Depends(current_user)
):
    return await EventParticipantDAO.get_user_events(session=session, user_id=user.id)
