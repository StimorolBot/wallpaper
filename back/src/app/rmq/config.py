from aio_pika import connect
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    HOST: str = "localhost"
    PORT: int = 5672
    LOGIN: str = "guest"
    PASSWORD: str = "guest"
    ROUTING_KEY: str = "friend"

settings = Settings()


async def get_connection() -> connect:
    return await connect(host=settings.HOST, port=settings.PORT, login=settings.LOGIN, password=settings.PASSWORD)


