from pydantic import BaseModel, ConfigDict, EmailStr


class Login(BaseModel):
    email: EmailStr
    password: str


class Register(Login):
    user_name: str
    is_active: bool = False
    is_superuser: bool = False
    is_verified: bool = False

    model_config = ConfigDict(from_attributes=True)
