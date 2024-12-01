import json
import string
import secrets
from uuid import uuid4
from pydantic import EmailStr
from fastapi import status, HTTPException, Request

from src.config import redis
from core.logger import auth_logger


def generate_uuid() -> str:
    return uuid4().hex


def valid_isalnum(val: str):
    if val.isalnum() is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Поле может содержать только буквы и цифры")


def valid_password(val: str):
    symbols = {
        "[", "]", "\\", "$", "|", "?", "*", "+",
        "(", ")", "{", "}", "/", "#", "'", '"',
        "@", " ", "!", "~", "`", "%", "=", "&"
    }
    if symbols & set(val):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Пароль но должен содержать: {symbols}")


def valid_len(val: str, min_val: int, max_val: int):
    if len(val) < min_val or len(val) > max_val:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Поле должно быть в пределах от {min_val} до {max_val} символов"
        )


async def set_redis(name: EmailStr, value: dict, ex: int = 2):
    value_str = json.dumps(value)
    await redis.set(name=name, value=value_str, ex=ex)


async def get_redis(key: EmailStr) -> dict | None:
    data_dict = await redis.get(key)
    if not data_dict:
        return None
    return json.loads(data_dict)


def generate_code(code_len: int = 6) -> str:
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(secrets.choice(letters_and_digits) for _ in range(code_len))


def get_info_from_headers(request: Request) -> list:
    client_ip = request.client.host
    try:
        user_agent = request.headers["user-agent"]
        origin = request.headers["origin"]
        return [user_agent, origin, client_ip]
    except KeyError:
        auth_logger.error("Не удалось получить данные из headers")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось получить данные из headers"
        )
