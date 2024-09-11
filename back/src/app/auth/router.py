from typing import Annotated
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException, Cookie

from core.crud import crud
from core.mode import ModeRead
from src.db.get_session import get_async_session

from src.app.auth.model import AuthTable
from src.app.auth.user_manager import user_manager
from src.app.auth.token.jwt_token import jwt_token
from src.app.auth.token.token_type import TokenType
from src.app.auth.token.schemas import TokenSchemas
from src.app.auth.token.config import auth_jwt_setting
from src.app.auth.schemas import Register, RegisterDTO, Login


register_router = APIRouter(prefix="/auth", tags=["auth"])


@register_router.post("/register", status_code=status.HTTP_201_CREATED, response_model=RegisterDTO)
async def register(register_user: Register, session: AsyncSession = Depends(get_async_session)):
    user = await crud.read(
        table=AuthTable, session=session,
        mode=ModeRead.ONE.value, field=AuthTable.email, value=register_user.email
    )
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с такой почтой уже существует"
        )
    reg_dict_user = user_manager.user_config(auth_dict_user=register_user.model_dump())
    await crud.create(session=session, table=AuthTable, data=reg_dict_user)
    return reg_dict_user


@register_router.post("/login", status_code=status.HTTP_200_OK)
async def login(login_user: Login, session: AsyncSession = Depends(get_async_session)):
    user = await user_manager.auth(auth_login=login_user, session=session)
    access_token = jwt_token.create(
        token_type=TokenType.ACCESS.value,
        token_data={"sub": f"{user.uuid}", "email": user.email}
    )
    refresh_token = jwt_token.create(
        token_type=TokenType.REFRESH.value,
        token_data={"sub": user.email},
        expire_timedelta=timedelta(days=auth_jwt_setting.refresh_token_expire_days)
    )
    exp = int(timedelta(days=auth_jwt_setting.refresh_token_expire_days).total_seconds())
    return TokenSchemas(access_token=access_token, refresh_token=refresh_token, refresh_max_age=exp)


@register_router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(auth_cookie: Annotated[str, Cookie()] = None, session: AsyncSession = Depends(get_async_session)):
    if not auth_cookie:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизирован")
    return "OK"
