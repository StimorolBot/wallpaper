from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from core.model import Base


class TagBufferTable(Base):
    __tablename__ = "tag_buffer_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tag_id: Mapped[int] = mapped_column(ForeignKey("tag_table.id"), index=True)
    uuid_img: Mapped[str] = mapped_column(ForeignKey("img_table.uuid_img"), index=True)



class TagTable(Base):
    __tablename__ = "tag_table"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    tag: Mapped[str] = mapped_column(index=True, unique=True)

