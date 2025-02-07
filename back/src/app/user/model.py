from typing import TYPE_CHECKING
from datetime import datetime

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.model import Base
from core.my_functools import get_unc_now

if TYPE_CHECKING:
    from src.app.auth.model import AuthTable


class UserTable(Base):
    __tablename__ = "user_table"

    uuid_user: Mapped[str] = mapped_column(ForeignKey("auth_table.uuid_user"), primary_key=True)
    last_visit: Mapped[datetime] = mapped_column(default=get_unc_now)
    avatar_user: Mapped[str] = mapped_column()

    auth_relationship: Mapped["AuthTable"] = relationship(back_populates="user_relationship")


class FriendTable(Base):
    __tablename__ = "friend_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid_user: Mapped[str] = mapped_column(ForeignKey("user_table.uuid_user"))
    subscriber_uuid: Mapped[str] = mapped_column(ForeignKey("user_table.uuid_user"))
    is_friend: Mapped[bool] = mapped_column()
    date_add: Mapped[datetime] = mapped_column(default=get_unc_now)
