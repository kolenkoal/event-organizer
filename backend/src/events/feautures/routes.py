import uuid
from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from src.auth.db_helper import db_helper
from src.events.feautures.schemas import EventFeatureCreate, EventFeatureRead
from src.events.models import Event, EventFeature

router = APIRouter(prefix="/event_features", tags=["Event Features"])


@router.post("/", response_model=EventFeatureRead)
async def add_event_feature(
    feature_data: EventFeatureCreate,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
):
    """Добавить новую функцию к событию."""
    event = await session.get(Event, feature_data.event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    feature = EventFeature(
        event_id=feature_data.event_id,
        feature_type=feature_data.feature_type,
        value=feature_data.value,
    )
    session.add(feature)
    await session.commit()
    await session.refresh(feature)
    return feature


@router.get("/{event_id}", response_model=List[EventFeatureRead])
async def get_event_features(
    event_id: uuid.UUID,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
):
    """Получить все функции, связанные с событием."""
    result = await session.execute(select(EventFeature).where(EventFeature.event_id == event_id))
    features = result.scalars().all()
    if not features:
        raise HTTPException(status_code=404, detail="No features found for this event")
    return features


@router.delete("/{feature_id}", response_model=EventFeatureRead)
async def delete_event_feature(
    feature_id: uuid.UUID,
    session: Annotated[AsyncSession, Depends(db_helper.session_getter)],
):
    """Удалить функцию события."""
    feature = await session.get(EventFeature, feature_id)
    if not feature:
        raise HTTPException(status_code=404, detail="Feature not found")

    await session.delete(feature)
    await session.commit()
    return feature
