import json
import base64
from typing import Annotated
from jwt.exceptions import DecodeError

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi_cache.decorator import cache
from starlette.websockets import WebSocketState
from fastapi import APIRouter, UploadFile, File, Depends, Cookie, WebSocket, status

from core.crud import crud
from src.app.rmq.publisher import publisher
from src.db.get_session import get_async_session
from src.app.auth.token.jwt_token import jwt_token
from src.app.img.get_user import get_user_by_token

from src.app.auth.model import AuthTable
from src.app.user.model import UserTable, FriendTable

from src.app.redis.name_space import NameSpace
from src.app.redis.config import fast_api_cache
from src.app.redis.operation_type import Operation
from src.app.redis.redis_func import get_redis, del_redis
from src.app.user.ws_manager import ws_manager

from src.app.user.schemas import ActionRequestSchema, AddUserSchema, ChangeAvatarSchema

user_router = APIRouter(tags=["user"], prefix="/user")


@user_router.get("/info")
@cache(expire=120, namespace=NameSpace.USER_INFO.value)
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


@user_router.websocket("/ws")
async def ws(
        websocket: WebSocket,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    await websocket.accept()
    await ws_manager.connect(uuid_user=user["sub"], websocket=websocket)

    await websocket.receive()
    if websocket.client_state.value == WebSocketState.DISCONNECTED.value:
        await ws_manager.disconnect(user["sub"], session)


@user_router.get("/last-visit")
async def get_last_visit(uuid_user: str, session: AsyncSession = Depends(get_async_session)) -> dict:
    user_last_visit = ws_manager.online_user.get("uuid_user")
    if user_last_visit:
        return {"status": "Online"}

    user_last_visit = await crud.read(session=session, table=UserTable.last_visit, uuid_user=uuid_user)
    return {"status": user_last_visit}


@user_router.post("/subscribe")
async def subscribe_user(friend_request: ActionRequestSchema, subscriber: dict = Depends(get_user_by_token)) -> dict:
    data = {
        "uuid_user": friend_request.uuid_user, "user_name": friend_request.user_name,
        "subscriber_uuid": subscriber["sub"], "operation": friend_request.operation.value
    }
    data_str = json.dumps(data)
    await publisher(msg=data_str.encode("utf-8"))
    return {"status_code": status.HTTP_200_OK, "data": "Заявка успешно отправлена"}


@user_router.get("/get-notification")
async def get_notification(access_token: Annotated[str, Cookie()] = None):
    if not access_token:
        return {"operation": None, "data": "Пользователь не авторизован"}

    user = get_user_by_token(access_token)
    data = await get_redis(user["sub"])
    if data:
        return ActionRequestSchema.model_validate(data, from_attributes=True)


@user_router.patch("/add-friend")
async def add_friend(
        user_data: AddUserSchema,
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
):
    await del_redis(name=f"{user["sub"]}/{Operation.FRIEND_REQUEST.value}")
    if user_data.is_add:
        await crud.update(
            table=FriendTable, session=session, data={"is_friend": True},
            uuid_user=user["sub"], subscriber_uuid=user_data.subscriber_uuid
        )


@user_router.post("/change-avatar")
async def change_avatar(
        img: UploadFile = File(...),
        user: dict = Depends(get_user_by_token),
        session: AsyncSession = Depends(get_async_session)
) -> dict:
    ChangeAvatarSchema(img_size=img.size, content_type=img.headers.get("content-type"))
    base64_img = base64.b64encode(img.file.read())
    await crud.update(
        session=session, table=UserTable,
        data={"avatar_user": str(base64_img.decode())},
        uuid_user=user["sub"]
    )
    await fast_api_cache.clear(NameSpace.USER_INFO.value)
    return {"status_code": status.HTTP_200_OK, "data": "Пользователь успешно изменил аватар"}
