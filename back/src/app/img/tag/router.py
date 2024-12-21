from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi_cache.decorator import cache
from fastapi_pagination import Page, paginate
from fastapi import APIRouter, Depends, status, HTTPException

from core.crud import crud
from core.logger import img_logger
from src.db.get_session import get_async_session

from src.app.img.model import ImgTable
from src.app.img.tag.schemas import TagSchemas, PopularTagDTO
from src.app.img.tag.model import TagBufferTable, TagTable

from src.app.img.tag.stmt import add_tag
from src.app.img.get_user import get_user_by_token

from src.app.llama.ollama_helper import Operation
from src.app.llama.llama_func import ollama_helper

tag_router = APIRouter(prefix="/tag", tags=["tag"])


@tag_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_tag(
        tag_data: TagSchemas,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    img_info = await crud.read(session=session, table=ImgTable, uuid_user=user["sub"], uuid_img=tag_data.uuid_img)
    try:
        if tag_data.is_automatically:
            tag_data.tag_list = await ollama_helper(img=img_info.img_base64, operation=Operation.CREATE_TAG)
    except AttributeError:
        img_logger.warning("Не удалось найти изображение с заданным uuid: %s", tag_data.uuid_img)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Не удалось найти изображение с заданным uuid: {tag_data.uuid_img}"
        )
    await add_tag(session=session, tag_list=tag_data.tag_list, uuid_img=tag_data.uuid_img)
    img_logger.debug(
        "Пользователь %s добавил теги %s к изображению %s",
        user["sub"], tag_data.tag_list, tag_data.uuid_img
    )
    return tag_data.tag_list


@tag_router.get("/get-popular-tag")
# @cache(expire=120)
async def get_popular_tag(session: AsyncSession = Depends(get_async_session)) -> Page:
    tag_count = func.count(TagBufferTable.tag_id).label("tag_count")
    label = TagTable.tag.label("label")
    value = TagBufferTable.tag_id.label("value")

    query = (
        select(tag_count, label, value)
        .select_from(TagBufferTable)
        .join(TagTable, TagTable.id == TagBufferTable.tag_id)
        .group_by(TagTable.id, value)
        .order_by(desc(tag_count))
    )

    res = await session.execute(query)
    popular_tag_list = res.mappings().all()

    data = [PopularTagDTO.model_validate(tag, from_attributes=True) for tag in popular_tag_list]
    return paginate(data)


@tag_router.patch("/update")
async def update_tag(
        tag_data: TagSchemas,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    await crud.update(
        session=session, table=ImgTable,
        data={"img_tag": tag_data.tags_list},
        uuid_user=user["sub"], uuid_img=tag_data.img_uuid
    )
    img_logger.debug("Пользователь %s обновил теги к изображению %s", user["sub"], tag_data.uuid_img)


@tag_router.delete("/delete")
async def delete_tag(user: dict = Depends(get_user_by_token), session: AsyncSession = Depends(get_async_session)):
    ...
