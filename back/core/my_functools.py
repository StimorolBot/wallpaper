import string
import secrets
from uuid import uuid4
from fastapi import status, HTTPException, Request

from core.logger import auth_logger


def generate_uuid() -> str:
    return uuid4().hex


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
