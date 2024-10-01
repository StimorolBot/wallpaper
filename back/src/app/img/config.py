import os
from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Settings(BaseSettings):
    API_KEY: str
    SECRET_KEY: str
    BASE_URL: str = "https://api-key.fusionbrain.ai/"

    model_config = SettingsConfigDict(env_file=PATH)


settings = Settings()
