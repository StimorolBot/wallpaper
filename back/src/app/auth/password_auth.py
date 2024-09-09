from src.app.auth.config import myctx
from core.abs_model.model import PasswordAuthABC


class PasswordAuth(PasswordAuthABC):
    @staticmethod
    def verify_password(hash_password: str, password: str) -> bool:
        return myctx.verify(password, hash_password)

    @staticmethod
    def get_hash_password(password: str) -> str:
        return myctx.hash(password)


password_auth = PasswordAuth()
