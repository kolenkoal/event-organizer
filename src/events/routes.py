from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.db_helper import db_helper
from src.events.dao import EventDAO
from src.events.schemas import EventCreateRequest, EventResponse
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
