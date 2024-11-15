FROM python:3.12.7

WORKDIR /back

RUN mkdir .log

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade -r requirements.txt

RUN alembic upgrade head

COPY . .

EXPOSE 80

CMD [ "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80" ]
