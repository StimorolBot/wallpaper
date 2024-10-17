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

---
* [Подготовка](#подготовка)
* [Запуск](#запуск)

---

## Подготовка
Перед запуском необходимо создать следующие файлы <code>.env</code> файлы:
* ```dotenv
   # ./back/src/db/.env
   DB_USER=postgres
   DB_PASS=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=postgres
  ```
* ```dotenv
    # ./back/tests/.env
    MODE=TEST
    DB_USER_TEST=postgres
    DB_PASS_TEST=postgres
    DB_HOST_TEST=localhost
    DB_PORT_TEST=5432
    DB_NAME_TEST=postgres_test
    ```
  
* Для получения ***API*** и ***SECRET KEY*** нужно зарегистрироваться на
[fusionbrain.ai](https://auth.fusionbrain.ai/realms/FB/protocol/openid-connect/auth?client_id=fusion-web&scope=openid%20email%20profile&response_type=code&redirect_uri=https%3A%2F%2Ffusionbrain.ai%2Fapi%2Fauth%2Fcallback%2Fkeycloak&state=04mcBTVCvfO1WQMYRCZLtsH3V6lmzRLeq4XGinLefpE&code_challenge=sQ8_Hyu9ISLDSfxaMt-R-EMGeoqx5KvNJbKcdkS5bAg&code_challenge_method=S256)  
    ```dotenv
    # ./back/src/app/img/.env
    API_KEY=API_KEY
    SECRET_KEY=SECRET_KEY
    ```
  
* ```dotenv
    # ./back/bg_task/.env
    PASSWORD=password
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
    #./back/src/app/auth/token/
    openssl rsa -in jwt-private.pem -outform PEM -pubout -out jwt-public.pem 
    ```

### Установка зависимостей
```bash
cd back
poetry install
```

Также необходимо создать в корне проекта директорию  ```.log``` для логирования

---

## Запуск:
* Backend:
  ```bash
  uvicorn back/src.main:app --reload
  ```
  После запуска приложения в браузере можно открыть [swagger](http://localhost:8000/docs)

* Celery:
  ```bash
  celery -A back.bg_task.setting:celery worker --loglevel=INFO --pool=solo
  ```

* [Flower](http://localhost:5555/):
  ```bash
  celery -A back.bg_task.config:celery flower --loglevel=info
  ```

* [Frontend](http://localhost:5173): 
  ```bash
  npm run dev
  ```
