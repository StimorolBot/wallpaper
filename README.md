<div align="center">
    <h1>Wallpaper</h1>
</div>

---
<div align="center">
    <img alt="Static Badge" src="https://img.shields.io/badge/-Python_3.12-%23354D73?style=flat&logo=python&labelColor=%231C1C1C">
    <br>
    <img alt="Static Badge" src="https://img.shields.io/badge/-FastApi_0.112.2-%23009B77?style=flat&logo=fastapi&labelColor=%231C1C1C">
    <img alt="Static Badge" style="padding: 0 10px" src="https://img.shields.io/badge/-SQLAlchemy_2.0.34-%23009B77?style=flat&logo=sqlalchemy&labelColor=%231C1C1C">
    <img alt="Static Badge" src="https://img.shields.io/badge/-Celery_5.4.0-%23009B77?style=flat&logo=celery&labelColor=%231C1C1C">
    <br>
    <img alt="Static Badge" style="padding: 0 10px" src="https://img.shields.io/badge/-Redis_5.0.8-%23D53032?style=flat&logo=redis&labelColor=%231C1C1C">
    <img alt="Static Badge" src="https://img.shields.io/badge/-PyDantic_2.9.0-%23FF0033?style=flat&logo=pydantic&labelColor=%231C1C1C">

</div>

---
[![testing app](https://github.com/StimorolBot/wallpaper/actions/workflows/testing.yml/badge.svg?branch=main)](https://github.com/StimorolBot/wallpaper/actions/workflows/testing.yml)

---

## Содержание

* [Подготовка](#подготовка)
* [Запуск](#запуск)
* [Docker](##Docker)

---

## Подготовка
Для того чтобы подключится к базе данных, нужно создать два файла:
<code>./back/src/db/.env</code> и <code>./back/tests.env</code>
со следующими значениями:
```dotenv
MODE=DEV/TEST
POSTGRES_PASSWORD=qwerty
POSTGRES_DB=wallpaper/wallpaper_test
POSTGRES_USER=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
``` 
Для получения **API** и **SECRET_KEY** нужно зарегистрироваться на
[fusionbrain.ai](https://auth.fusionbrain.ai/realms/FB/protocol/openid-connect/auth?client_id=fusion-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Ffusionbrain.ai%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=04mcBTVCvfO1WQMYRCZLtsH3V6lmzRLeq4XGinLefpE&code_challenge=sQ8_Hyu9ISLDSfxaMt-R-EMGeoqx5KvNJbKcdkS5bAg&code_challenge_method=S256)  
```dotenv
# ./back/src/app/img/.env
API_KEY=API_KEY
SECRET_KEY=SECRET_KEY
```
Для создания приложения, необходимо авторизоваться в **Google**. </br>
После чего в ***Пароли приложений*** создать свое приложение
```dotenv
# ./back/celery_task/smtp/.env
PASSWORD=app_password
ADMIN_EMAIL=email.example.com
```
### Генерация токенов
* Приватного:
    ```bash
    # ./back/src/app/auth/token/
    openssl genrsa -out jwt-private.pem 2048 
    ```
* Публичного:
    ```bash
    # ./back/src/app/auth/token/
    openssl rsa -in jwt-private.pem -outform PEM -pubout -out jwt-public.pem 
    ```

### Установка зависимостей
```bash
# ./back
poetry install
```
```bash
# ./front
npm install
```
Также необходимо создать директорию  ```./back/.log``` для логирования. </br>
\* Если вы используете **Windows**, то скачайте архив с [Redis](https://github.com/tporadowski/redis/releases). Разархивируйте его и запустите файл <code>redis-server.exe</code>

---

## Запуск:
* Backend:
  ```bash
  # ./back
  uvicorn src.main:app --reload
  ```
  После запуска приложения в браузере можно открыть [swagger](http://localhost:8000/docs)

* Celery:
  ```bash
  # ./back
  celery -A celery_task.config:celery worker --loglevel=INFO --pool=solo
  ```

* [Flower](http://localhost:5555/):
  ```bash
  # ./back
  celery -A celery_task.config:celery flower --loglevel=INFO
  ```

* [Frontend](http://localhost:5173): 
  ```bash
  # ./front
  npm run dev
  ```
 
## Docker
### Dockerfile:
* Для создания образа необходимо перейти в директорию с Dockerfile и выполнить:
  ```bash
    # ./front
    docker build ./front --tag "wallpaper-front"
  ```
* Для запуска: 
  ```bash
    # ./front
    docker run -p 5173:5173 "wallpaper-front"
  ```
* Или в корне проекта выполнить:
  ```bash
    make buildFront
    make runFront
  ```
### Docker compose
* Для создания контейнера и его запуска выполнить:
  ```bash
    docker compose up 
  ```
После запуска контейнера приложение откроется на:
* [Frontend](http://127.0.0.1:80)
* [Backend](http://127.0.0.1:8000)
* [pgAdmin](http://127.0.0.1:5000)
* [Flower](http://127.0.0.1:5555)
