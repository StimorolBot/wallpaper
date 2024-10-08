from datetime import datetime
from typing import TYPE_CHECKING, List

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.model import Base
from core.help import generate_uuid

if TYPE_CHECKING:
    from src.app.img.model import ImgTable


class AuthTable(Base):
    __tablename__ = "user_table"

    uuid_user: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid)
    user_name: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column(unique=True, index=True)
    hash_password: Mapped[str] = mapped_column()
    date_register: Mapped[datetime] = mapped_column(server_default=func.CURRENT_TIMESTAMP())
    is_active: Mapped[bool] = mapped_column(default=True)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    is_verified: Mapped[bool] = mapped_column(default=False)

    img_relationship: Mapped[List["ImgTable"]] = relationship(back_populates="user_relationship")
