from typing import Annotated
from jwt.exceptions import DecodeError

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi_cache.decorator import cache
from fastapi import APIRouter, UploadFile, File, Depends, Cookie, WebSocket
from starlette.websockets import WebSocketState

from core.crud import crud
from src.app.auth.model import AuthTable
from src.app.user.model import UserTable
from src.app.user.schemas import UuidUser
from src.redis.redis_func import get_redis
from src.app.user.ws_manager import ws_manager
from src.db.get_session import get_async_session
from src.app.auth.token.jwt_token import jwt_token
from src.app.img.get_user import get_user_by_token

user_router = APIRouter(tags=["user"], prefix="/user")


@user_router.get("")
# @cache(expire=120) # сделать так, что бы если есть какойто флаг, сбрасывал кеш
async def get_user_info(
        access_token: Annotated[str | None, Cookie()] = None,
        session: AsyncSession = Depends(get_async_session)
):
    try:
        user = jwt_token.decode(access_token)
        query = (
            select(AuthTable.user_name, UserTable.avatar_user, UserTable.uuid_user)
            .filter_by(uuid_user=user["sub"])
            .join(AuthTable, UserTable.uuid_user == AuthTable.uuid_user)
        )
        res = await session.execute(query.distinct())
        user_info = res.mappings().all()
        return user_info
    except DecodeError:
        return None


@user_router.websocket("/last-visit")
async def last_visit(
        websocket: WebSocket,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    await websocket.accept()
    await ws_manager.connect(user["sub"])

    await websocket.receive()
    if websocket.client_state.value == WebSocketState.DISCONNECTED.value:
        await ws_manager.disconnect(user["sub"], session)


@user_router.post("/last-visit")
async def get_last_visit(uuid_user: UuidUser, session: AsyncSession = Depends(get_async_session)) -> dict:
    user_last_visit = await get_redis(uuid_user.uuid_user)

    if user_last_visit:
        return {"last_visit": "Online"}

    user_last_visit = await crud.read(session=session, table=UserTable.last_visit, uuid_user=uuid_user.uuid_user)
    return {"last_visit": f"{user_last_visit}"}


@user_router.post("/set-avatar")
async def set_avatar(img: UploadFile = File(...)):
    print(img)


@user_router.post("/subscribe")
async def subscribe_user(
        uuid: UuidUser,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    return


@user_router.delete("/unsubscribe")
async def unsubscribe_user(
        uuid: UuidUser,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    return


@user_router.delete("/delete-user")
async def delete_user(user: dict = Depends(get_user_by_token), session: AsyncSession = Depends(get_async_session)):
    return
