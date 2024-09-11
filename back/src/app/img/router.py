from typing import Annotated

from fastapi_cache.decorator import cache
from fastapi import APIRouter, status, Depends, HTTPException, Cookie

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from core.crud import crud
from src.db.get_session import get_async_session

from src.app.img.model import ImgTable
from src.app.img.generate_img import api
from src.app.img.schemas import ImageSchemas, ImageInfoDTO

from src.app.auth.model import AuthTable
from src.app.auth.token.jwt_token import jwt_token

img_router = APIRouter(tags=["img"])


def get_user_by_token(access_token: Annotated[str, Cookie()] = None) -> dict:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизирован")
    return jwt_token.decode(token=access_token)


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


@img_router.get("/wallpaper/{uuid_img}",  response_model=ImageInfoDTO)
async def get_img(uuid_img: str, session: AsyncSession = Depends(get_async_session)):
    query = (
        select(AuthTable)
        .options(selectinload(AuthTable.img_relationship))
        .where(ImgTable.uuid_img == uuid_img)
    )
    res = await session.execute(query)
    img_info = res.scalar()

    if not img_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Не удалось найти '{uuid_img}'")

    return img_info.__dict__

