from src.dao import BaseDAO
from src.events.models import Event


class EventDAO(BaseDAO):
    model = Event
