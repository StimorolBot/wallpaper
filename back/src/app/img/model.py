from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.model import Base
from core.my_functools import generate_uuid

if TYPE_CHECKING:
    from src.app.auth.model import AuthTable
    from src.app.img.reaction.model import ReactionTable


class ImgTable(Base):
    __tablename__ = "img_table"

    uuid_img: Mapped[str] = mapped_column(primary_key=True, default=generate_uuid, index=True, unique=True)
    uuid_user: Mapped[str] = mapped_column(ForeignKey("auth_table.uuid_user"))
    style: Mapped[str] = mapped_column()
    create_date: Mapped[datetime] = mapped_column(server_default=func.CURRENT_TIMESTAMP())
    prompt: Mapped[str] = mapped_column()
    img_tag: Mapped[str | None] = mapped_column()
    is_public: Mapped[bool] = mapped_column(default=False)
    img_base64: Mapped[str] = mapped_column()

    user_relationship: Mapped["AuthTable"] = relationship(back_populates="img_relationship")
    reaction_relationship: Mapped["ReactionTable"] = relationship(back_populates="img_reaction_relationship")
