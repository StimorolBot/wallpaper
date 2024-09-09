from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).parent.parent


class AuthJWT(BaseModel):
    private_path_key: Path = BASE_DIR / "token" / "jwt-private.pem"
    public_path_key: Path = BASE_DIR / "token" / "jwt-public.pem"
    algorithm: str = "RS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 30


auth_jwt_setting = AuthJWT()
