from datetime import datetime, UTC
from sqlalchemy.ext.asyncio import AsyncSession

from core.crud import crud
from core.logger import user_logger
from src.app.user.model import UserTable
from src.redis.redis_func import set_redis, del_redis


class ConnectionManager:
    def __init__(self):
        self.online_user: set[str] = {""}

    async def connect(self, uuid_user: str):
        if (uuid_user in self.online_user) is False:
            self.online_user.add(uuid_user)
            await set_redis(name=uuid_user, value={"status": "online"}, ex=60)
            user_logger.debug("Пользователь %s зашел на сайт", uuid_user)

    async def disconnect(self, uuid_user: str, session: AsyncSession):
        last_visit_time = datetime.now(UTC)
        await crud.update(session=session, table=UserTable, data={"last_visit": last_visit_time}, uuid_user=uuid_user)
        await del_redis(uuid_user)
        self.online_user.remove(uuid_user)
        user_logger.debug("Пользователь %s покинул сайт в %s", uuid_user, last_visit_time)


ws_manager = ConnectionManager()
