from fastapi_cache.decorator import cache
from fastapi import APIRouter, status, Depends, HTTPException

from sqlalchemy import select, func
from sqlalchemy.sql.functions import concat
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import INTERVAL

from core.crud import crud
from core.help import create_dict, get_item
from src.db.get_session import get_async_session
from src.app.img.get_user import get_user_by_token

from src.app.img.model import ImgTable
from src.app.img.generate_img import api
from src.app.img.schemas import ImageSchemas
from src.app.img.reaction.model import ReactionTable
from src.app.img.reaction.count_reaction_query import count_reaction

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

    return base64_img


@img_router.get("/")
@cache(expire=120)
async def get_all_img(session: AsyncSession = Depends(get_async_session)):
    img_list = await crud.read(session=session, table=ImgTable)
    return img_list


@img_router.get("/popular")
@cache(expire=10)
async def get_popular_img(session: AsyncSession = Depends(get_async_session)):
    query = (
        select(
            ImgTable
        )
        .where(ImgTable.create_date >= func.now() - func.cast(concat(10, ' DAYS'), INTERVAL))
    )
    r = await session.execute(query)
    return get_item(r)


@img_router.get("/wallpaper/{uuid_img}")
@cache(expire=120)
async def get_img(uuid_img: str, session: AsyncSession = Depends(get_async_session)):
    sub_query = (
        select(
            AuthTable.user_name,
            ImgTable.prompt,
            ImgTable.style,
            ImgTable.create_date,
            ImgTable.img_base64
        )
        .select_from(AuthTable)
        .join(ImgTable, ImgTable.uuid_user == AuthTable.uuid_user)
        .where(ImgTable.uuid_img == uuid_img)
    ).subquery("select_img_uuid")

    like_count_query = count_reaction(
        lbl_name="like_count", uuid_img=uuid_img, subquery="like_count_subquery", reaction_type=True
    )
    dislike_count_query = count_reaction(
        lbl_name="dislike_count", uuid_img=uuid_img, subquery="dislike_count_subquery", reaction_type=False
    )

    query = (
        select(
            sub_query,
            like_count_query,
            dislike_count_query
        )
        .distinct()
        .select_from(ReactionTable)
    )

    res = await session.execute(query)
    img_info = res.all()

    if not img_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Не удалось найти '{uuid_img}'")

    img_dict = create_dict(
        list_key=["user_name", "prompt", "style", "create_date", "img_base64", "like", "dislike"],
        list_value=get_item(img_info)
    )

    return img_dict


@img_router.post("/set-reaction")
async def set_reaction(
    uuid_img: str,
    user: dict = Depends(get_user_by_token),
    session: AsyncSession = Depends(get_async_session)
):
    ...

