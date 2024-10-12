from src.dao import BaseDAO
from src.events.models import Event, EventParticipant


class EventDAO(BaseDAO):
    model = Event


class EventParticipantDAO(BaseDAO):
    model = EventParticipant
