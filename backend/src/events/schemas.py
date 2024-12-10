import uuid
from datetime import datetime

from pydantic import UUID4, BaseModel
from pydantic_settings import SettingsConfigDict


class EventCreateRequest(BaseModel):
    title: str
    description: str
    start_time: datetime
    end_time: datetime
    location: str


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


class EventParticipantCreate(BaseModel):
    event_id: UUID4
    user_id: UUID4


class EventParticipantResponse(BaseModel):
    event_id: UUID4
    user_id: UUID4
    created_at: datetime

    model_config = SettingsConfigDict(from_attributes=True)


class EventParticipantWithoutEventResponse(BaseModel):
    user_id: UUID4
    registration_date: datetime

    model_config = SettingsConfigDict(from_attributes=True)


class EventParticipantsResponse(BaseModel):
    event_id: UUID4
    participants: list[EventParticipantWithoutEventResponse]

    model_config = SettingsConfigDict(from_attributes=True)


class SubEventResponse(BaseModel):
    id: uuid.UUID
    title: str
    start_time: datetime
    end_time: datetime
    location: str | None = None

    class Config:
        from_attributes = True


class EventWithSubEventsResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    location: str | None = None
    sub_events: list[SubEventResponse]

    class Config:
        from_attributes = True
