import os
from pydantic_settings import BaseSettings, SettingsConfigDict

PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class SettingTest(BaseSettings):
    MODE: str
    DB_USER_TEST: str
    DB_PASS_TEST: str
    DB_HOST_TEST: str
    DB_PORT_TEST: str
    DB_NAME_TEST: str

    model_config = SettingsConfigDict(env_file=PATH)

    @property
    def get_db_url(self) -> str:
        return (
            f"postgresql+asyncpg://{self.DB_USER_TEST}:{self.DB_PASS_TEST}"
            f"@{self.DB_HOST_TEST}:{self.DB_PORT_TEST}/{self.DB_NAME_TEST}"
        )


config_test = SettingTest()
