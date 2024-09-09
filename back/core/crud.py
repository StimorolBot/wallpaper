from core.mode import ModeRead
from core.abs_model.model import CrudAbs

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, delete
from sqlalchemy.orm.decl_api import DeclarativeAttributeIntercept


class Crud(CrudAbs):
    @staticmethod
    async def create(session: AsyncSession, table: DeclarativeAttributeIntercept, data: dict):
        stmt = table(**data)
        session.add(stmt)
        await session.commit()

    @staticmethod
    async def read(
            session: AsyncSession, table: DeclarativeAttributeIntercept,
            mode: ModeRead = ModeRead.ALL.value, **kwargs
    ) -> list:
        match mode:
            case ModeRead.ONE.value:
                stmt = select(table).where(kwargs["field"] == kwargs["value"])
                results = await session.execute(stmt)
                return results.unique().scalar_one_or_none()

            case ModeRead.ALL.value:
                stmt = select(table)
                results = await session.execute(stmt)
                return [item for items in results.all() for item in items]

    @staticmethod
    async def update(session: AsyncSession, table: DeclarativeAttributeIntercept, field, field_val, data: dict):
        query = update(table).where(func.lower(field) == func.lower(field_val)).values(**data)
        await session.execute(query)
        await session.commit()

    @staticmethod
    async def delite(session: AsyncSession, table: DeclarativeAttributeIntercept, field, field_val):
        stmt = delete(table).where(func.lower(field) == func.lower(field_val))
        await session.execute(stmt)
        await session.commit()


crud = Crud()
