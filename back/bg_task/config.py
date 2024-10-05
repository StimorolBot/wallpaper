import os
import socket
from celery import Celery
from pydantic_settings import BaseSettings, SettingsConfigDict


PATH = f"{os.path.dirname(os.path.abspath(__file__))}/.env"


class Smtp(BaseSettings):
    PASSWORD: str
    port: int = 465
    host: str = "smtp.gmail.com"
    ADMIN_EMAIL: str
    expire: int = 120
    worker_name: str = f"celery@{socket.gethostname()}"

    model_config = SettingsConfigDict(env_file=PATH)


smtp_setting = Smtp()

celery = Celery("smtp", broker="redis://localhost:6379", backend="redis://localhost:6379")
celery.autodiscover_tasks(["celery"])
