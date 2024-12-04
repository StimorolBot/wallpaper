from typing import Annotated
from fastapi_pagination import Page, paginate
from fastapi import APIRouter, status, Depends, HTTPException, Cookie, Response

from sqlalchemy import select, func, and_, case, desc
from sqlalchemy.sql.functions import concat
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import INTERVAL

from core.crud import crud
from core.logger import img_logger

from src.db.get_session import get_async_session
from src.app.img.get_user import get_user_by_token

from src.app.auth.model import AuthTable
from src.app.img.model import ImgTable
from src.app.img.generate_img import api
from src.app.img.enums.filter_time import FilterTime
from src.app.img.enums.status_r import StatusReaction
from src.app.img.reaction.model import ReactionTable
from src.app.img.sql_request import get_info_about_img
from src.app.img.reaction.schemas import ReactionSchemas
from src.app.img.schemas import ImageSchemas, AllImageDTO, PublishSchemas, ValidUuidImg

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
    query = await get_info_about_img(access_token, is_public=True)
    res = await session.execute(query.order_by(desc(ImgTable.create_date)))
    img_list = res.mappings().all()
    data = [AllImageDTO.model_validate(item, from_attributes=True) for item in img_list]

    return paginate(data)


@img_router.get("/popular")
async def get_popular_img(
        response: Response,
        filter_time: FilterTime,
        access_token: Annotated[str, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
) -> Page:
    query = await get_info_about_img(access_token)
    if filter_time.value not in FilterTime.ALL.value:
        query = query.where(
            ImgTable.create_date >= func.now()
            -
            func.cast(concat(1, f" {filter_time.value}"), INTERVAL)
        )

    res = await session.execute(query.order_by(desc(ImgTable.create_date)))
    img_list = res.mappings().all()

    response.headers["Filter-Time"] = filter_time.value
    data = [AllImageDTO.model_validate(item, from_attributes=True) for item in img_list]
    return paginate(data)


@img_router.get("/wallpaper/{uuid_img}")
async def get_img_by_uuid(
        uuid_img: ValidUuidImg, access_token: Annotated[str, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
):
    like_subquery = (
        select(func.count().label("like_count"))
        .select_from(ReactionTable)
        .filter_by(reaction=True, uuid_img=uuid_img)
        .subquery("like_subquery")
    )

    dislike_subquery = (
        select(func.count().label("dislike_count"))
        .select_from(ReactionTable)
        .filter_by(reaction=False, uuid_img=uuid_img)
        .subquery("dislike_subquery")
    )

    query = await get_info_about_img(
        access_token,
        ImgTable.style, ImgTable.prompt, ImgTable.create_date,
        AuthTable.user_name, like_subquery, dislike_subquery,
        uuid_img=uuid_img, is_public=True
    )

    res = await session.execute(query.distinct())
    img_query = res.mappings().all()

    if not img_query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Не удалось найти '{uuid_img}'")

    return img_query


@img_router.post("/set-reaction", status_code=status.HTTP_200_OK)
async def set_reaction(
        reaction: ReactionSchemas,
        session: AsyncSession = Depends(get_async_session),
        user: dict = Depends(get_user_by_token)
):
    query_case = (
        case(
            (ReactionTable.uuid_user == user["sub"],
             case(
                 (ReactionTable.uuid_img == reaction.img_uuid,
                  case(
                      (ReactionTable.reaction == reaction.reaction, StatusReaction.EQUAL_REACTIONS.value),
                      else_=StatusReaction.DIFFERENT_REACTIONS.value
                  )),
                 else_=StatusReaction.NO_REACTION.value
             )),
            else_=StatusReaction.NO_REACTION.value,
        )
    )

    query = (
        select(query_case)
        .where(and_(
            ReactionTable.uuid_user == user["sub"],
            ReactionTable.uuid_img == reaction.img_uuid)
        )
    )

    result = await session.execute(query)
    result = result.unique().all()

    if not result:
        await crud.create(
            session=session,
            table=ReactionTable,
            data={"uuid_user": user["sub"], "uuid_img": reaction.img_uuid, "reaction": reaction.reaction}
        )
        img_logger.debug("Добавлена запись для %s", reaction.img_uuid)
        return

    match result[-1][0]:
        case StatusReaction.EQUAL_REACTIONS.value:
            await crud.delite(
                session=session,
                table=ReactionTable,
                uuid_user=user["sub"],
                uuid_img=reaction.img_uuid
            )
            img_logger.debug("Реакция удалена")

        case StatusReaction.DIFFERENT_REACTIONS.value:
            await crud.update(
                session=session,
                table=ReactionTable,
                uuid_user=user["sub"],
                uuid_img=reaction.img_uuid,
                data={"reaction": reaction.reaction}
            )
            img_logger.debug("Реакция обновлена")

        case StatusReaction.NO_REACTION.value:
            await crud.create(
                session=session,
                table=ReactionTable,
                data={"uuid_user": user["sub"], "uuid_img": reaction.img_uuid, "reaction": reaction.reaction}
            )
            img_logger.debug("Реакция создана")


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
