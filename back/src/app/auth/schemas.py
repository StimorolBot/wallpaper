from typing_extensions import Annotated
from fastapi import status, HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, WrapValidator


def valid_name(name: str, handler) -> str:
    if len(name) < 2 or len(name) > 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Имя пользователя должен быть в пределах от 2 до 20 символов")
    return name


ValidName = Annotated[str, WrapValidator(valid_name)]


class Login(BaseModel):
    email: EmailStr
    password: str


class Register(Login):
    user_name: ValidName
    is_active: bool = False
    is_superuser: bool = False
    is_verified: bool = False

    model_config = ConfigDict(from_attributes=True)


class RegisterDTO(BaseModel):
    user_name: ValidName
    email: EmailStr
