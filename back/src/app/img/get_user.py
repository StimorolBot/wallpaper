from typing import Annotated

from fastapi import Cookie, HTTPException
from starlette import status

from src.app.auth.token.jwt_token import jwt_token


def get_user_by_token(access_token: Annotated[str, Cookie()] = None) -> dict:
    if not access_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизирован")
    return jwt_token.decode(token=access_token)
