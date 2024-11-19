from redis import asyncio as aioredis
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_USER_NAME: str = "user_name"
    REDIS_PASSWORD: str = "password"

    @property
    def get_url(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}"

settings = Settings()

redis = aioredis.from_url(settings.get_url, encoding="utf-8", decode_responses=True) # передать psd и name
