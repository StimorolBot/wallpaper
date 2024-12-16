from pydantic import BaseModel, ConfigDict, EmailStr

from celery_task.smtp.type_email import TypeEmail
from core.validator import ValidName, ValidPassword, ValidCodeConfirm


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
