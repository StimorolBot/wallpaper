from typing import List
from datetime import datetime
from pydantic import BaseModel
from src.app.img.style_img import StyleImg


class ImageSchemas(BaseModel):
    prompt: str  # Максимальный размер текстового описания - 1000 символов.
    style: StyleImg
    width: int = 1024
    height: int = 1024


class ImageSchemasDTO(BaseModel):
    prompt: str
    style: StyleImg
    create_date: datetime


class ImageInfoDTO(BaseModel):
    user_name: str
    img_relationship: List["ImageSchemasDTO"]
