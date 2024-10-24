import jwt
from jwt.exceptions import InvalidSignatureError, ExpiredSignatureError

from fastapi import status, HTTPException
from datetime import datetime, timedelta, timezone

from core.abs_model.model import JWTTokenABC
from src.app.auth.token.config import auth_jwt_setting
from src.app.auth.token.token_type import TokenType


class JWTToken(JWTTokenABC):
    @staticmethod
    def encode(
            payload: dict,
            algorithm: str = auth_jwt_setting.algorithm,
            private_key: str = auth_jwt_setting.private_path_key.read_text(),
            expire_timedelta: timedelta | None = None,
            expire_minutes: int = auth_jwt_setting.access_token_expire_minutes
    ):
        to_encode = payload.copy()
        now = datetime.now(timezone.utc)
        if expire_timedelta:
            expire = now + expire_timedelta
        else:
            expire = now + timedelta(minutes=expire_minutes)
        to_encode.update(exp=expire, iat=now)
        return jwt.encode(to_encode, private_key, algorithm=algorithm)

    @staticmethod
    def decode(
            token: str,
            algorithms: str = auth_jwt_setting.algorithm,
            public_key: str = auth_jwt_setting.public_path_key.read_text()
    ):
        try:
            return jwt.decode(token, public_key, algorithms=algorithms)
        except ExpiredSignatureError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Время жизни токена истекло")

    def create(self, token_type: TokenType, token_data: dict, expire_timedelta: timedelta | None = None):
        jwt_payload = {"type": token_type}
        jwt_payload.update(token_data)
        return self.encode(payload=jwt_payload, expire_timedelta=expire_timedelta)

    def valid_type(self, token: str, token_type: TokenType) -> dict:
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Пользователь не авторизован")
        try:
            payload = self.decode(token)
            if payload.get("type") != token_type:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Неверный тип токена")
            return payload

        except InvalidSignatureError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Невалидный токен")

    def refresh(self, refresh_token: str) -> str:
        payload = self.valid_type(token=refresh_token, token_type=TokenType.REFRESH.value)
        access_token = self.create(
            token_type=TokenType.ACCESS.value,
            token_data={"sub": payload["sub"]}
        )
        return access_token


jwt_token = JWTToken()
