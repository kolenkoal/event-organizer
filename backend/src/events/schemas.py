import enum
import uuid
from datetime import datetime
from typing import Literal

from pydantic import UUID4, BaseModel
from pydantic_settings import SettingsConfigDict


class EventCreateRequest(BaseModel):
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    location: str | None = None
    requires_participants: bool = False


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
    event_id: UUID4 | None = None
    user_id: UUID4 | None = None
    role: Literal["LISTENER", "PARTICIPANT"] = "LISTENER"
    artifacts: list[str] | None = None

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

    model_config = SettingsConfigDict(from_attributes=True)


class EventWithSubEventsResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    location: str | None = None
    sub_events: list[SubEventResponse]

    model_config = SettingsConfigDict(from_attributes=True)


class ParticipantRole(str, enum.Enum):
    LISTENER = "LISTENER"
    PARTICIPANT = "PARTICIPANT"


class ParticipantStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELED = "CANCELED"


class EventParticipantResponse(BaseModel):
    event_id: UUID4
    user_id: UUID4
    role: ParticipantRole
    created_at: datetime
    artifacts: list[str] | None = None

    model_config = SettingsConfigDict(from_attributes=True)
