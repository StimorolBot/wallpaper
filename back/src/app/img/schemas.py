from typing_extensions import Annotated
from fastapi import status, HTTPException
from pydantic import BaseModel, WrapValidator

from src.app.img.enums.style_img import StyleImg
from core.my_functools import valid_len, valid_uuid


def valid_size_img(size: int, handler) -> int:
    if 249 < int(size) or int(size) > 1024:
        return size

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Недопустимое значение для размера изображения"
    )


def valid_prompt_img(prompt: str, handler) -> str:
    valid_len(val=prompt, min_val=4, max_val=1000)
    return prompt


ValidSizeImg = Annotated[int, WrapValidator(valid_size_img)]
ValidPromptImg = Annotated[str, WrapValidator(valid_prompt_img)]
ValidUuidImg = Annotated[str, WrapValidator(valid_uuid)]


class ImageSchemas(BaseModel):
    prompt: ValidPromptImg
    style: StyleImg
    width: ValidSizeImg = 1024
    height: ValidSizeImg = 1024
    is_public: bool = False


class AllImageDTO(BaseModel):
    img_base64: str
    uuid_img: ValidUuidImg
    reaction: bool | None = None

class PublishSchemas(BaseModel):
    uuid_img: ValidUuidImg
