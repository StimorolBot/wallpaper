import json
import string
import secrets
from uuid import uuid4
from fastapi import status, HTTPException, Request

from src.conf import redis
from core.logger import auth_logger


def generate_uuid() -> str:
    return uuid4().hex


def create_dict(list_key: list, list_value: list) -> dict:
    return dict(zip(list_key, list_value))


def get_item(main_list) -> list:
    return [item for items in main_list for item in items]


def valid_forbidden_symbols(val: str, email: bool = False):
    symbols = {
        "[", "]", "\\", "^", "$", "|", "?", "*", "+", "(", ")",
        "{", "}", "/", "#", "'", '"', "@", " ", "-", "!", "~",
        "`", ".", ",", "%", "=", "№", "&"
    }

    if email:
        symbols.remove("@")
        symbols.remove(".")

    if symbols & set(val):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Поле не должно содержать: {symbols}")


def valid_len(val: str, min_val: int, max_val: int):
    if len(val) < min_val or len(val) > max_val:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Поле должно быть в пределах от {min_val} до {max_val} символов"
        )


async def set_redis(name: str, value: dict, ex: int = 2):
    value_str = json.dumps(value)
    await redis.set(name=name, value=value_str, ex=ex)


async def get_redis(key: str) -> dict | None:
    data_dict = await redis.get(key)
    if not data_dict:
        return None
    return json.loads(data_dict)


def generate_code(code_len: int = 6) -> str:
    letters_and_digits = string.ascii_letters + string.digits
    return ''.join(secrets.choice(letters_and_digits) for _ in range(code_len))


def get_info_from_headers(request: Request) -> list:
    try:
        user_agent = request.headers["user-agent"]
        origin = request.headers["origin"]
        client_ip = request.headers["x-forwarded-for"]
        return [user_agent, origin, client_ip]
    except KeyError:
        auth_logger.error("Не удалось получить данные из headers")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Не удалось получить данные из headers"
        )
