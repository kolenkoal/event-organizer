import datetime
import uuid

from sqlalchemy import ARRAY, Boolean, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.events.schemas import ParticipantRole, ParticipantStatus
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
    requires_participants: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    parent_event_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("events.id"), nullable=True
    )

    sub_events = relationship("Event", back_populates="parent_event", lazy="selectin")
    parent_event = relationship("Event", remote_side="Event.id", back_populates="sub_events", lazy="selectin")

    participants = relationship("EventParticipant", back_populates="event", lazy="selectin")
    organizer = relationship("User", back_populates="events", lazy="selectin")


class EventParticipant(Base):
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    event_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("events.id"), primary_key=True)
    role: Mapped[ParticipantRole] = mapped_column(
        Enum(ParticipantRole), nullable=False, default=ParticipantRole.LISTENER
    )
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc), nullable=False
    )
    status: Mapped[ParticipantStatus] = mapped_column(
        Enum(ParticipantStatus), nullable=False, default=ParticipantStatus.PENDING
    )
    artifacts: Mapped[list[str] | None] = mapped_column(ARRAY(String), nullable=True)

    event = relationship("Event", back_populates="participants", lazy="selectin")
    user = relationship("User", back_populates="participated_events", lazy="selectin")
