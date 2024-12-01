from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    llama: str = "llama3.2"
    llava: str = "llava:7b"

settings = Settings()
