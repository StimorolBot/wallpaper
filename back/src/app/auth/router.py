from datetime import timedelta
from hmac import compare_digest
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException

from core.crud import crud
from core.logger import auth_logger, smtp_logger
from src.db.get_session import get_async_session
from core.my_functools import generate_code, set_redis, get_redis, get_info_from_headers

from src.app.auth.model import AuthTable
from src.app.img.get_user import get_user_by_token
from src.app.auth.user_manager import user_manager
from src.app.auth.token.jwt_token import jwt_token
from src.app.auth.token.token_type import TokenType
from src.app.auth.token.schemas import TokenSchemas
from src.app.auth.password_auth import password_auth
from src.app.auth.token.config import auth_jwt_setting
from src.app.auth.schemas import Register, RegisterDTO, Login, CodeConfirm, ResetPassword

from bg_task.config import celery
from bg_task.tasks import send_email

register_router = APIRouter(prefix="/auth", tags=["auth"])


@register_router.post("/get-code", status_code=status.HTTP_200_OK)
async def get_code_confirm(data: CodeConfirm, info_headers: list = Depends(get_info_from_headers)):
    user_agent, origin, client_host = info_headers
    code = generate_code()

    task = send_email.apply_async(args=(
        data.email,
        data.email_type.value,
        code, user_agent,
        origin, client_host
    ),
        ignore_result=False)
    celery.AsyncResult(task.id)
    await set_redis(name=data.email, value={"code": code}, ex=40)
    smtp_logger.info("Запрос на подтверждение учетной записи: %s", data.email)


@register_router.post("/register", status_code=status.HTTP_201_CREATED, response_model=RegisterDTO)
async def register(register_user: Register, session: AsyncSession = Depends(get_async_session)):
    user = await crud.read(table=AuthTable, session=session, email=register_user.email)

    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с такой почтой уже существует"
        )

    code = await get_redis(key=register_user.email)
    if not code or compare_digest(register_user.code_confirm, code["code"]) is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный код подтверждения")

    reg_dict_user = user_manager.user_config(auth_dict_user=register_user.model_dump())
    await crud.create(session=session, table=AuthTable, data=reg_dict_user)

    auth_logger.info("Создание учетной записи: %s", reg_dict_user["email"])
    return reg_dict_user


@register_router.post("/login", status_code=status.HTTP_200_OK)
async def login(login_user: Login, session: AsyncSession = Depends(get_async_session)):
    user = await user_manager.auth(auth_login=login_user, session=session)
    access_token = jwt_token.create(
        token_type=TokenType.ACCESS.value,
        token_data={"sub": user.uuid_user, "email": user.email}
    )
    refresh_token = jwt_token.create(
        token_type=TokenType.REFRESH.value,
        token_data={"sub": user.uuid_user},
        expire_timedelta=timedelta(days=auth_jwt_setting.refresh_token_expire_days)
    )

    exp = int(timedelta(days=auth_jwt_setting.refresh_token_expire_days).total_seconds())

    await crud.update(
        session=session,
        table=AuthTable,
        email=user.email,
        data={"is_active": True}
    )

    auth_logger.info("Вход в учетную запись: %s", user.email)
    return TokenSchemas(access_token=access_token, refresh_token=refresh_token, refresh_max_age=exp)


@register_router.patch("/logout", status_code=status.HTTP_200_OK)
async def logout(user: dict = Depends(get_user_by_token), session: AsyncSession = Depends(get_async_session)):
    await crud.update(
        session=session,
        table=AuthTable,
        email=user["email"],
        data={"is_active": False}
    )
    auth_logger.info("Выход из учетной записи: %s", user["email"])


@register_router.patch("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(data: ResetPassword, session: AsyncSession = Depends(get_async_session)):
    code = await get_redis(key=data.email)

    if not code or data.code_confirm != code["code"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный код подтверждения")

    hash_password = password_auth.get_hash_password(data.password)

    await crud.update(
        session=session,
        table=AuthTable,
        email=data.email,
        data={"hash_password": hash_password}
    )
    auth_logger.info("Пароль успешно изменен: %s", data.email)
