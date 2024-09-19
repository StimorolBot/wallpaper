from typing_extensions import Annotated
from fastapi import status, HTTPException
from src.app.img.enums.style_img import StyleImg
from pydantic import BaseModel, WrapValidator


def valid_size_img(size: int, handler) -> int:
    if int(size) < 250 or int(size) > 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Размер изображения должен быть в пределах от 250 до 1024")
    return size


def valid_prompt_img(prompt: str, handler) -> str:
    if len(prompt) >= 1000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Промт должен содержать меньше 1000 символов"
        )
    return prompt


ValidSizeImg = Annotated[int, WrapValidator(valid_size_img)]
ValidPromptImg = Annotated[str, WrapValidator(valid_prompt_img)]


class ImageSchemas(BaseModel):
    prompt: ValidPromptImg
    style: StyleImg
    width: ValidSizeImg = 1024
    height: ValidSizeImg = 1024




