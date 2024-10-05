from typing import Annotated

from fastapi import Depends
from sqlalchemy import delete, insert, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.db_helper import db_helper


class BaseDAO:
    model = None

    @classmethod
    async def find_by_id(cls, model_id, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]) -> model:
        query = select(cls.model).filter_by(id=model_id)

        result = await session.execute(query)

        return result.scalar_one_or_none()

    @classmethod
    async def find_one_or_none(
        cls, session: Annotated[AsyncSession, Depends(db_helper.session_getter)], **filter_by
    ) -> model:
        query = select(cls.model).filter_by(**filter_by)

        result = await session.execute(query)

        return result.scalar_one_or_none()

    @classmethod
    async def find_all(cls, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
        query = select(cls.model).order_by(cls.model.name)

        result = await session.execute(query)

        values = result.scalars().all()

        return values

    @classmethod
    async def validate_by_id(cls, value, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
        query = select(cls.model).where(cls.model.id == value)

        result = (await session.execute(query)).scalar_one_or_none()

        return result

    @classmethod
    async def add(cls, session: Annotated[AsyncSession, Depends(db_helper.session_getter)], **data):
        query = insert(cls.model).values(**data)
        await session.execute(query)
        await session.commit()

    @classmethod
    async def create(cls, session: AsyncSession, **data):
        create_query = insert(cls.model).values(**data).returning(cls.model)

        result = await session.execute(create_query)
        await session.commit()

        return result.scalar_one()

    @classmethod
    async def update_data(cls, model_id, data, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
        update_item_query = update(cls.model).where(cls.model.id == model_id).values(**data).returning(cls.model)

        updated_item = await session.execute(update_item_query)
        await session.commit()

        return updated_item.scalars().one()

    @classmethod
    async def delete_certain_item(cls, model_id, session: Annotated[AsyncSession, Depends(db_helper.session_getter)]):
        delete_item_query = delete(cls.model).where(cls.model.id == model_id)

        await session.execute(delete_item_query)
        await session.commit()

        return None
