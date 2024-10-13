from typing import Annotated
from fastapi_cache.decorator import cache
from fastapi_pagination import Page, paginate
from fastapi import APIRouter, status, Depends, HTTPException, Cookie, Response

from sqlalchemy import select, func, and_, case, desc
from sqlalchemy.sql.functions import concat
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import INTERVAL

from core.crud import crud
from core.logger import img_logger
from core.help import create_dict, get_item
from src.db.get_session import get_async_session
from src.app.auth.token.jwt_token import jwt_token

from src.app.img.get_user import get_user_by_token

from src.app.img.model import ImgTable
from src.app.img.generate_img import api
from src.app.img.schemas import ImageSchemas, ImageSchemasDTO
from src.app.img.enums.filter_time import FilterTime
from src.app.img.enums.status_r import StatusReaction
from src.app.img.reaction.model import ReactionTable
from src.app.img.reaction.schemas import ReactionSchemas

from src.app.auth.model import AuthTable

img_router = APIRouter(tags=["img"])


@img_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_img(
        image_schemas: ImageSchemas,
        session: AsyncSession = Depends(get_async_session),
        user: dict = Depends(get_user_by_token)
) -> str:
    base64_img = await api.get_base64_img(
        prompt=image_schemas.prompt, style=image_schemas.style.value,
        width=image_schemas.width, height=image_schemas.height
    )
    data = {
        "prompt": image_schemas.prompt,
        "img_base64": base64_img,
        "style": image_schemas.style.value,
        "uuid_user": user["sub"]
    }
    await crud.create(session=session, data=data, table=ImgTable)
    img_logger.debug("Изображение создано")

    return base64_img


@img_router.get("/", status_code=status.HTTP_200_OK)
async def get_all_img(
        access_token: Annotated[str, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
) -> Page:
    list_key = ["uuid_img", "img_base64"]

    if not access_token:
        query = (
            select(
                ImgTable.uuid_img,
                ImgTable.img_base64,
            )
        )

    elif access_token:
        list_key.append("reaction")
        user = jwt_token.decode(token=access_token)

        query = (
            select(
                ImgTable.uuid_img,
                ImgTable.img_base64,
                ReactionTable.reaction
            ).join(
                ReactionTable,
                and_(
                    ReactionTable.uuid_user == user["sub"],
                    ReactionTable.uuid_img == ImgTable.uuid_img
                ),
                isouter=True
            )
        )

    res = await session.execute(query.order_by(desc(ImgTable.create_date)))
    img_list = res.all()

    data = [
        create_dict(
            list_value=item,
            list_key=list_key
        ) for item in img_list
    ]

    return paginate(data)


@img_router.get("/popular")
async def get_popular_img(
        response: Response,
        filter_time: FilterTime,
        session: AsyncSession = Depends(get_async_session)
) -> Page:
    if filter_time.value not in FilterTime.ALL.value:
        query = (
            select(
                ImgTable
            )
            .where(
                ImgTable.create_date >= func.now()
                -
                func.cast(concat(1, f" {filter_time.value}"), INTERVAL)
            )
            .order_by(desc(ImgTable.create_date))
        )

    elif filter_time.value in FilterTime.ALL.value:
        query = select(ImgTable).order_by(desc(ImgTable.create_date))

    res = await session.execute(query)
    dto = [ImageSchemasDTO.model_validate(item, from_attributes=True) for item in get_item(res)]

    response.headers["Filter-Time"] = filter_time.value
    return paginate(dto)


@img_router.get("/wallpaper/{uuid_img}")
@cache(expire=30)
async def get_img_by_uuid(uuid_img: str, session: AsyncSession = Depends(get_async_session)):
    user_subquery = (
        select(AuthTable.user_name)
        .where(AuthTable.uuid_user == ImgTable.uuid_user)
        .subquery("user_subquery")
    )

    like_subquery = select(func.count().label("like_c")).filter(
        ReactionTable.reaction == True,
        ReactionTable.uuid_img == uuid_img
    ).subquery("like_subquery")

    dislike_subquery = select(func.count().label("dislike_c")).filter(
        ReactionTable.reaction == False,
        ReactionTable.uuid_img == uuid_img
    ).subquery("dislike_subquery")

    query = (
        select(
            ImgTable.prompt,
            ImgTable.style,
            ImgTable.create_date,
            ImgTable.img_base64,
            user_subquery,
            like_subquery,
            dislike_subquery
        )
        .distinct()
        .where(ImgTable.uuid_img == uuid_img)
    )

    res = await session.execute(query)
    img_query = res.all()

    if not img_query:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Не удалось найти '{uuid_img}'")

    img_data = create_dict(
        list_key=["prompt", "style", "create_date", "img_base64", "user_name", "like", "dislike"],
        list_value=get_item(img_query)
    )

    return img_data


@img_router.post("/set-reaction")
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
