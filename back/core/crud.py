from core.abs_model.model import CrudAbs

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm.decl_api import DeclarativeAttributeIntercept


class Crud(CrudAbs):
    @staticmethod
    async def create(session: AsyncSession, table: DeclarativeAttributeIntercept, data: dict):
        stmt = table(**data)
        session.add(stmt)
        await session.commit()

    @staticmethod
    async def read(session: AsyncSession, table: DeclarativeAttributeIntercept, **kwargs) -> list:
        stmt = select(table).filter_by(**kwargs)
        results = await session.execute(stmt)
        return results.unique().scalar_one_or_none()

    @staticmethod
    async def update(session: AsyncSession, table: DeclarativeAttributeIntercept, data: dict, **kwargs):
        query = update(table).filter_by(**kwargs).values(**data)
        await session.execute(query)
        await session.commit()

    @staticmethod
    async def delite(session: AsyncSession, table: DeclarativeAttributeIntercept, **kwargs):
        stmt = delete(table).filter_by(**kwargs)
        await session.execute(stmt)
        await session.commit()


crud = Crud()
