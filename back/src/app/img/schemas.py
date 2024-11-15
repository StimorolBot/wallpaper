from typing_extensions import Annotated
from fastapi import status, HTTPException
from pydantic import BaseModel, WrapValidator

from core.my_functools import valid_len
from src.app.img.enums.style_img import StyleImg
from core.my_functools import valid_forbidden_symbols


def valid_size_img(size: int, handler) -> int:
    if size in [1024, 576, 680]:
        return size

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Недопустимое значение для размера изображения"
    )


def valid_prompt_img(prompt: str, handler) -> str:
    valid_len(val=prompt, min_val=4, max_val=1000)
    valid_forbidden_symbols(prompt)
    return prompt


ValidSizeImg = Annotated[int, WrapValidator(valid_size_img)]
ValidPromptImg = Annotated[str, WrapValidator(valid_prompt_img)]


class ImageSchemas(BaseModel):
    prompt: ValidPromptImg
    style: StyleImg
    width: ValidSizeImg = 1024
    height: ValidSizeImg = 1024


class AllImageDTO(BaseModel):
    img_base64: str
    uuid_img: str
    reaction: bool | None = None
