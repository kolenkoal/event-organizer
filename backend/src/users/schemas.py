import datetime
import uuid

from fastapi_users.schemas import BaseUser, BaseUserCreate, BaseUserUpdate
from pydantic import BaseModel, Field


class UserRead(BaseUser[uuid.UUID]):
    first_name: str
    last_name: str


class UserCreate(BaseUserCreate):
    first_name: str = Field(max_length=256)
    last_name: str = Field(max_length=256)


class UserUpdate(BaseUserUpdate):
    first_name: str | None = Field(None, max_length=256)
    last_name: str | None = Field(None, max_length=256)


class OrganizedEventResponse(BaseModel):
    id: uuid.UUID
    title: str
    start_time: datetime.datetime


class ParticipatedEventResponse(BaseModel):
    id: uuid.UUID
    title: str
    start_time: datetime.datetime


class UserEventsResponse(BaseModel):
    organized_events: list[OrganizedEventResponse]
    participated_events: list[ParticipatedEventResponse]


class Event(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    start_time: datetime.datetime
    end_time: datetime.datetime
    location: str


class EventWithSubEvents(Event):
    sub_events: list[Event] = []


class AllEventsResponse(BaseModel):
    events: list[Event | EventWithSubEvents]
