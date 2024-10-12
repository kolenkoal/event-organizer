import enum
from datetime import datetime

from pydantic import UUID4, BaseModel
from pydantic_settings import SettingsConfigDict


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


class ParticipantStatus(enum.Enum):
    REGISTERED = "registered"
    ATTENDED = "attended"
    CANCELED = "canceled"


class EventParticipantCreate(BaseModel):
    event_id: UUID4
    user_id: UUID4


class EventParticipantResponse(BaseModel):
    event_id: UUID4
    user_id: UUID4
    status: str
    created_at: datetime

    model_config = SettingsConfigDict(from_attributes=True)
