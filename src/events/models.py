import datetime
import uuid

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.models import Base


class Event(Base):
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(length=256), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    start_time: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )  # Временная зона поддерживается
    end_time: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    location: Mapped[str] = mapped_column(String(length=256), nullable=True)
    organizer_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.datetime.now(datetime.timezone.utc), nullable=False
    )

    organizer = relationship("User", back_populates="events")
