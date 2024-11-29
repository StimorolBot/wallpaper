from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from core.crud import crud
from core.logger import img_logger
from src.db.get_session import get_async_session

from src.app.img.model import ImgTable
from src.app.img.tag.schemas import TagSchemas
from src.app.img.get_user import get_user_by_token

from src.app.llama.operation_type import Operation
from src.app.llama.llama_func import create_tag as llama_create_tag

tag_router = APIRouter(prefix="/tag", tags=["tag"])


@tag_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_tag(
        tag_data: TagSchemas,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    img_info = await crud.read(session=session, table=ImgTable, uuid_user=user["sub"], uuid_img=tag_data.uuid_img)

    if tag_data.is_automatically:
        tag_data.tag_list = await llama_create_tag(img=img_info.img_base64, operation=Operation.CREATE_TAG)

    await crud.update(
        session=session, table=ImgTable,
        data={"img_tag": tag_data.tag_list},
        uuid_user=user["sub"], uuid_img=tag_data.uuid_img
    )
    img_logger.debug("Пользователь %s добавил теги к изображению %s", user["sub"], tag_data.uuid_img)
    return tag_data.tag_list


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
