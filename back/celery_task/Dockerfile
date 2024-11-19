FROM python:3.12.7

RUN pip install --no-cache-dir --upgrade pydantic-settings==2.4.0, \
    celery==5.4.0, redis==5.0.8 flower==2.0.1

COPY . ./celery_task
