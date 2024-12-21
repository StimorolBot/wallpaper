from typing import Annotated
from fastapi_pagination import Page, paginate
from fastapi import APIRouter, status, Depends, HTTPException, Cookie

from sqlalchemy import select, func, desc
from sqlalchemy.sql.functions import concat
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import INTERVAL

from core.crud import crud
from core.my_functools import get_unc_now
from core.logger import img_logger

from src.db.get_session import get_async_session
from src.app.img.get_user import get_user_by_token

from src.app.img.model import ImgTable
from src.app.user.model import UserTable
from src.app.auth.model import AuthTable
from src.app.img.generate_img import api
from src.app.img.enums.filter_time import FilterTime
from src.app.img.enums.operation_type import Operation
from src.app.img.reaction.model import ReactionTable
from src.app.img.query import get_info_about_img
from src.app.img.reaction.schemas import ReactionSchemas
from src.app.img.schemas import ImageSchemas, AllImageDTO, PublishSchemas, AboutImgDTO

img_router = APIRouter(tags=["img"])


@img_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_img(
        image_schemas: ImageSchemas,
        session: AsyncSession = Depends(get_async_session),
        user: dict = Depends(get_user_by_token)
) -> dict:
    base64_img = await api.get_base64_img(
        prompt=image_schemas.prompt, style=image_schemas.style.value,
        width=image_schemas.width, height=image_schemas.height
    )
    data = {
        "prompt": image_schemas.prompt,
        "img_base64": base64_img,
        "style": image_schemas.style.value,
        "uuid_user": user["sub"],
        "is_public": image_schemas.is_public
    }
    stmt = await crud.create(session=session, data=data, table=ImgTable)
    img_logger.debug("Пользователь %s создал изображение %s", stmt.uuid_user, stmt.uuid_img)

    return {"uuid_img": stmt.uuid_img, "base64_img": base64_img}


@img_router.get("/", status_code=status.HTTP_200_OK)
async def get_all_img(
        access_token: Annotated[str, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
) -> Page:
    query = get_info_about_img(access_token)
    res = await session.execute(query.order_by(desc(ImgTable.create_date)))
    img_list = res.mappings().all()
    data = [AllImageDTO.model_validate(item, from_attributes=True) for item in img_list]

    return paginate(data)


@img_router.get("/popular")
async def get_popular_img(
        filter_time: FilterTime,
        access_token: Annotated[str, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
) -> Page:
    query = get_info_about_img(access_token)
    if filter_time.value not in FilterTime.ALL.value:
        query = query.where(
            ImgTable.create_date >= get_unc_now()
            -
            func.cast(concat(1, f" {filter_time.value}"), INTERVAL)
        )

    res = await session.execute(query.order_by(desc(ImgTable.create_date)))
    img_list = res.mappings().all()

    data = [AllImageDTO.model_validate(item, from_attributes=True) for item in img_list]
    return paginate(data)


@img_router.get("/wallpaper/{uuid_img}")
async def get_img_by_uuid(
        uuid_img: str, access_token: Annotated[str, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
):
    subquery = get_info_about_img(
        access_token, True, False,
        ImgTable.style, ImgTable.prompt,
        ImgTable.uuid_user,
        ImgTable.negative_prompt,
        uuid_img=uuid_img
    ).subquery("base_select")

    query = (
        select(subquery, UserTable.avatar_user, AuthTable.user_name)
        .select_from(subquery)
        .join(UserTable, UserTable.uuid_user == subquery.c.uuid_user)
        .join(AuthTable, AuthTable.uuid_user == subquery.c.uuid_user)
    )

    res = await session.execute(query.distinct())
    img_list = res.mappings().all()

    if not img_list:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Не удалось найти '{uuid_img}'")

    return [AboutImgDTO.model_validate(item, from_attributes=True) for item in img_list]


@img_router.post("/set-reaction", status_code=status.HTTP_200_OK)
async def set_reaction(
        reaction: ReactionSchemas,
        session: AsyncSession = Depends(get_async_session),
        user: dict = Depends(get_user_by_token)
):
    match reaction.operation_type.value:
        case Operation.CREATE.value:
            check_rec = await crud.read(
                session=session, table=ReactionTable,
                uuid_user=user["sub"], uuid_img=reaction.img_uuid
            )
            if not check_rec:  # вставить через EXIST
                await crud.create(
                    session=session,
                    table=ReactionTable,
                    data={"uuid_user": user["sub"], "uuid_img": reaction.img_uuid, "reaction": reaction.reaction}
                )
                img_logger.debug("Добавлена реакция для %s", reaction.img_uuid)
        case Operation.UPDATE.value:
            await crud.update(
                session=session,
                table=ReactionTable,
                uuid_user=user["sub"],
                uuid_img=reaction.img_uuid,
                data={"reaction": reaction.reaction}
            )
            img_logger.debug("Реакция обновлена")
        case Operation.DELETE.value:
            await crud.delite(
                session=session,
                table=ReactionTable,
                uuid_user=user["sub"],
                uuid_img=reaction.img_uuid
            )
            img_logger.debug("Реакция удалена")


@img_router.post("/publish")
async def publish(
        img: PublishSchemas,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    await crud.update(
        session=session, table=ImgTable,
        uuid_user=user["sub"], uuid_img=img.uuid_img,
        data={"is_public": True}
    )
    img_logger.debug("Пользователь %s сделал изображение %s публичным", user["sub"], img.uuid_img)
