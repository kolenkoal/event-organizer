from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import UUID4
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.db_helper import db_helper
from src.events.dao import EventDAO, EventParticipantDAO
from src.events.schemas import (
    EventCreateRequest,
    EventParticipantCreate,
    EventParticipantResponse,
    EventResponse,
    EventUpdateRequest,
)
from src.users.dao import UserDAO

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("", response_model=EventResponse)
async def create_event(
    event_data: EventCreateRequest, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]
):
    if not await UserDAO.check_organizer_exists(session=session, organizer_id=event_data.organizer_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organizer not found")

    new_event = await EventDAO.create(session=session, **event_data.model_dump())

    return new_event


@router.post("/{event_id}/register", response_model=EventParticipantResponse)
async def register_for_event(
    event_id: UUID4, user_id: UUID4, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]
):
    event = await EventDAO.find_by_id(session=session, model_id=event_id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

    if not await UserDAO.find_by_id(session=session, model_id=user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    event_participant_data = EventParticipantCreate(user_id=user_id, event_id=event_id)
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
