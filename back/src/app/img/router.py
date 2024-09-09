from sqlalchemy.ext.asyncio import AsyncSession

from fastapi_cache.decorator import cache
from fastapi import APIRouter, status, Depends, HTTPException

from core.crud import crud
from core.mode import ModeRead
from src.app.img.model import ImgTable
from src.db.get_session import get_async_session

from src.app.img.generate_img import api
from src.app.img.schemas import ImageSchemas

img_router = APIRouter(tags=["img"])


@img_router.post("/create", status_code=status.HTTP_201_CREATED)
async def create_img(image_schemas: ImageSchemas, session: AsyncSession = Depends(get_async_session)) -> str:
    base64_img = await api.get_base64_img(
        prompt=image_schemas.prompt, style=image_schemas.style.value,
        width=image_schemas.width, height=image_schemas.height
    )
    data = {"prompt": image_schemas.prompt, "img_base64": base64_img}
    await crud.create(session=session, data=data, table=ImgTable)

    return base64_img


@img_router.get("/")
@cache(expire=120)
async def get_all_img(session: AsyncSession = Depends(get_async_session)):
    img_list = await crud.read(session=session, table=ImgTable)
    return img_list


@img_router.get("/wallpaper/{uuid_img}")
async def get_img(uuid_img: str, session: AsyncSession = Depends(get_async_session)):
    img_info = await crud.read(
        session=session, table=ImgTable,
        mode=ModeRead.ONE.value, value=uuid_img, field=ImgTable.uuid_img
    )
    if not img_info:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Не удалось найти '{uuid_img}'")

    return img_info
