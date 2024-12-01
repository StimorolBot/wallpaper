from typing_extensions import Annotated
from pydantic import BaseModel, ConfigDict, WrapValidator, EmailStr

from celery_task.smtp.type_email import TypeEmail
from core.my_functools import valid_password as valid_password_symbol
from core.my_functools import valid_isalnum, valid_len


def valid_name(name: str, handler) -> str:
    valid_len(name, 4, 20)
    valid_isalnum(name)
    return name


def valid_password(password: str, handler) -> str:
    valid_len(password, 8, 32)
    valid_password_symbol(password)
    return password


def valid_code_confirm(code_confirm: str, handler) -> str:
    valid_len(code_confirm, min_val=5, max_val=7)
    valid_isalnum(code_confirm)
    return code_confirm


ValidName = Annotated[str, WrapValidator(valid_name)]
ValidPassword = Annotated[str, WrapValidator(valid_password)]
ValidCodeConfirm = Annotated[str, WrapValidator(valid_code_confirm)]


class Email(BaseModel):
    email: EmailStr


class CodeConfirm(Email):
    email_type: TypeEmail


class Login(Email):
    password: ValidPassword


class Register(Login):
    user_name: ValidName
    code_confirm: ValidCodeConfirm
    is_active: bool = False
    is_superuser: bool = False
    is_verified: bool = False

    model_config = ConfigDict(from_attributes=True)


class RegisterDTO(Email):
    user_name: ValidName


class ResetPassword(Email):
    password: ValidPassword
    code_confirm: ValidCodeConfirm
