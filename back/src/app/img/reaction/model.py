from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from core.model import Base

if TYPE_CHECKING:
    from src.app.img.model import ImgTable


class ReactionTable(Base):
    __tablename__ = "reaction_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    uuid_user: Mapped[str] = mapped_column(ForeignKey("user_table.uuid_user"))
    uuid_img: Mapped[str] = mapped_column(ForeignKey("img_table.uuid_img"))
    reaction: Mapped[bool | None] = mapped_column()

    img_reaction_relationship: Mapped["ImgTable"] = relationship(back_populates="reaction_relationship")
