from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    API_KEY: str
    SECRET_KEY: str
    BASE_URL: str = "https://api-key.fusionbrain.ai/"

    model_config = SettingsConfigDict(env_file="./src/app/img/.env")


settings = Settings()
