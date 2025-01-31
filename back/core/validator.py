from uuid import UUID

from starlette import status
from fastapi import HTTPException
from pydantic import WrapValidator
from typing_extensions import Annotated


def valid_forbidden_char(val: str):
    symbols = {
        "\\", "$", "|", "?", "*",
        "/", "#", "'", '"', "@",
        " ", "!", "`", "%", "&"
    }
    if symbols & set(val):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Пароль но должен содержать: {symbols}")


def valid_size_img(size: int, handler) -> int:
    if 250 <= int(size) <= 1024:
        return size

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Недопустимое значение для размера изображения"
    )


def valid_prompt_img(prompt: str, handler) -> str:
    valid_len(val=prompt, min_val=2, max_val=1000)
    return prompt


def valid_name(name: str, handler) -> str:
    valid_len(name, 4, 20)
    valid_isalnum(name)
    return name


def valid_password(password: str, handler) -> str:
    valid_len(password, 8, 32)
    valid_forbidden_char(password)
    return password


def valid_code_confirm(code_confirm: str, handler) -> str:
    valid_len(code_confirm, min_val=5, max_val=7)
    valid_isalnum(code_confirm)
    return code_confirm


def valid_uuid(uuid: str, handler, version: int = 4) -> str:
    try:
        return UUID(uuid, version=version).hex
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Некорректный uuid")


def valid_isalnum(val: str):
    if val.isalnum() is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Поле может содержать только буквы и цифры")


def valid_len(val: str, min_val: int, max_val: int):
    if len(val) < min_val or len(val) > max_val:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Поле должно быть в пределах от {min_val} до {max_val} символов"
        )


ValidUuid = Annotated[str, WrapValidator(valid_uuid)]
ValidName = Annotated[str, WrapValidator(valid_name)]
ValidSizeImg = Annotated[int, WrapValidator(valid_size_img)]
ValidPassword = Annotated[str, WrapValidator(valid_password)]
ValidPromptImg = Annotated[str, WrapValidator(valid_prompt_img)]
ValidCodeConfirm = Annotated[str, WrapValidator(valid_code_confirm)]
