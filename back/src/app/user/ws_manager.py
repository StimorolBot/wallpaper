from fastapi import WebSocket
from sqlalchemy.ext.asyncio import AsyncSession

from core.crud import crud
from core.logger import user_logger
from core.my_functools import get_unc_now

from src.app.user.model import UserTable
from core.validator import ValidUuid


class ConnectionManager:
    def __init__(self):
        self.online_user: dict[WebSocket] = {}

    async def connect(self, uuid_user: ValidUuid, websocket: WebSocket):
        self.online_user[uuid_user] = websocket
        user_logger.debug("Пользователь %s зашел на сайт", uuid_user)

    async def disconnect(self, uuid_user: ValidUuid, session: AsyncSession):
        last_visit_time = get_unc_now()
        del self.online_user[uuid_user]
        await crud.update(session=session, table=UserTable, data={"last_visit": last_visit_time}, uuid_user=uuid_user)
        user_logger.debug("Пользователь %s покинул сайт", uuid_user)


ws_manager = ConnectionManager()
