from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.model import Base
from core.generate_uuid import generate_uuid

if TYPE_CHECKING:
    from src.app.auth.model import AuthTable


class ImgTable(Base):
    __tablename__ = "img_table"

    uuid: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid, index=True, unique=True)
    uuid_img: Mapped[str] = mapped_column(unique=True, index=True, default=generate_uuid)
    uuid_user: Mapped[str] = mapped_column(ForeignKey("user_table.uuid"))
    style: Mapped[str] = mapped_column()
    create_date: Mapped[datetime] = mapped_column(server_default=func.CURRENT_TIMESTAMP())
    prompt: Mapped[str] = mapped_column()
    img_base64: Mapped[str] = mapped_column()

    user_relationship: Mapped["AuthTable"] = relationship(back_populates="img_relationship")
