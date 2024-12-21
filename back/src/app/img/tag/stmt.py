from sqlalchemy import select, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as insert_ignore

from src.app.img.model import ImgTable
from src.app.img.tag.model import TagTable, TagBufferTable


async def add_tag_to_img(uuid_img: str, tag_list: list[str], session: AsyncSession):
    select_stmt = (
        select(TagTable.id, ImgTable.uuid_img)
        .select_from(TagTable).where(TagTable.tag.in_(tag_list))
        .join(ImgTable, ImgTable.uuid_img == uuid_img)
    )
    insert_stmt = insert(TagBufferTable).from_select(["tag_id", "uuid_img"], select_stmt)
    await session.execute(insert_stmt)


async def add_tag(uuid_img: str, tag_list: list[str], session: AsyncSession):
    stmt = insert_ignore(TagTable).values([{"tag": tag} for tag in tag_list])
    await session.execute(stmt.on_conflict_do_nothing())
    await add_tag_to_img(uuid_img, tag_list, session)
    await session.commit()
