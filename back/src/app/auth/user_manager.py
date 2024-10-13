from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends, HTTPException, status

from core.crud import crud
from src.db.get_session import get_async_session
from core.abs_model.model import UserManagerABC

from src.app.auth.schemas import Login
from src.app.auth.model import AuthTable
from src.app.auth.password_auth import password_auth


class UserManager(UserManagerABC):

    async def auth(self, auth_login: Login, session: AsyncSession = Depends(get_async_session)):
        unauthorized_error_msg = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин/пароль"
        )

        user = await crud.read(session=session, table=AuthTable, email=auth_login.email)
        if not user:
            raise unauthorized_error_msg

        is_verify_password = password_auth.verify_password(
            hash_password=user.hash_password, password=auth_login.password
        )
        if is_verify_password is False:
            raise unauthorized_error_msg

        return user

    @staticmethod
    def user_config(auth_dict_user: dict) -> dict:
        auth_dict_user["hash_password"] = password_auth.get_hash_password(auth_dict_user["password"])
        auth_dict_user["is_active"] = False
        auth_dict_user["is_superuser"] = False
        auth_dict_user["is_verified"] = False

        del auth_dict_user["password"]
        del auth_dict_user["code_confirm"]

        return auth_dict_user


user_manager = UserManager()
