import datetime
import uuid
from typing import Dict, Optional

from pydantic import BaseModel


class EventFeatureCreate(BaseModel):
    event_id: uuid.UUID
    feature_type: str
    value: Optional[Dict] = None


class EventFeatureRead(BaseModel):
    id: uuid.UUID
    event_id: uuid.UUID
    feature_type: str
    value: Optional[Dict] = None
    created_at: datetime.datetime

    class Config:
        orm_mode = True
