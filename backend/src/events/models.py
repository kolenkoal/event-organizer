import datetime
import uuid

from sqlalchemy import JSON, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.events.schemas import ParticipantStatus
from src.models import Base


class Event(Base):
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(length=256), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    start_time: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    end_time: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[str] = mapped_column(String(length=256), nullable=True)
    organizer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc), nullable=False
    )

    participants = relationship("EventParticipant", back_populates="event", lazy="selectin")
    organizer = relationship("User", back_populates="events", lazy="selectin")
    features = relationship("EventFeature", back_populates="event", lazy="selectin")


class EventParticipant(Base):
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"), primary_key=True)

    status: Mapped[ParticipantStatus] = mapped_column(
        Enum(ParticipantStatus), nullable=False, default=ParticipantStatus.REGISTERED
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc), nullable=False
    )

    event = relationship("Event", back_populates="participants", lazy="selectin")
    user = relationship("User", back_populates="participated_events", lazy="selectin")


class EventFeature(Base):
    __tablename__ = "event_features"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"), nullable=False)
    feature_type: Mapped[str] = mapped_column(
        String(length=128), nullable=False
    )  # Например, "calendar", "participants_list"
    value: Mapped[dict] = mapped_column(JSON, nullable=True)

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc), nullable=False
    )

    event = relationship("Event", back_populates="features", lazy="selectin")
