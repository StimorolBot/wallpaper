from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.model import Base
from core.my_functools import generate_uuid, get_unc_now

if TYPE_CHECKING:
    from src.app import AuthTable
    from src.app.img.reaction.model import ReactionTable


class ImgTable(Base):
    __tablename__ = "img_table"

    uuid_img: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid, index=True, unique=True)
    uuid_user: Mapped[str] = mapped_column(ForeignKey("auth_table.uuid_user"))
    style: Mapped[str] = mapped_column()
    create_date: Mapped[datetime] = mapped_column(default=get_unc_now)
    prompt: Mapped[str] = mapped_column()
    negative_prompt: Mapped[str | None] = mapped_column()
    pg_rating: Mapped[str] = mapped_column(default="all")
    is_public: Mapped[bool] = mapped_column(default=False)
    img_base64: Mapped[str] = mapped_column()

    auth_relationship: Mapped["AuthTable"] = relationship(back_populates="img_relationship")
    reaction_relationship: Mapped["ReactionTable"] = relationship(back_populates="img_relationship")
