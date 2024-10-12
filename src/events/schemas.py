from datetime import datetime

from pydantic import UUID4, BaseModel


class EventCreateRequest(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    location: str
    organizer_id: UUID4


class EventResponse(BaseModel):
    id: UUID4
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    location: str
    organizer_id: UUID4
    created_at: datetime


class EventUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    start_time: datetime | None = None
    end_time: datetime | None = None
    location: str | None = None