from typing_extensions import Annotated
from fastapi import status, HTTPException
from pydantic import BaseModel, ConfigDict, WrapValidator

from bg_task.type_email import TypeEmail
from core.help import valid_forbidden_symbols, valid_len


def valid_name(name: str, handler) -> str:
    valid_len(name, 4, 20)
    valid_forbidden_symbols(name)

    return name


def valid_password(password: str, handler) -> str:
    valid_len(password, 8, 32)
    valid_forbidden_symbols(password)

    return password


def valid_email(email: str, handler) -> str:

    if len(email.split("@")) != 2 or len(email.split(".")) != 2:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Некорректный формат почты")

    valid_len(email, 10, 40)
    valid_forbidden_symbols(email, email=True)
    return email


ValidName = Annotated[str, WrapValidator(valid_name)]
ValidEmail = Annotated[str, WrapValidator(valid_email)]
ValidPassword = Annotated[str, WrapValidator(valid_password)]


class Email(BaseModel):
    email: ValidEmail


class CodeConfirm(Email):
    email_type: TypeEmail


class Login(Email):
    password: ValidPassword


class Register(Login):
    user_name: ValidName
    code_confirm: str
    is_active: bool = False
    is_superuser: bool = False
    is_verified: bool = False

    model_config = ConfigDict(from_attributes=True)


class RegisterDTO(Email):
    user_name: ValidName


class ResetPassword(Email):
    password: ValidPassword
    code_confirm: str

