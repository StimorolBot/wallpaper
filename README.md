<div align="center">
    <h1>Wallpaper</h1>
</div>

---
<div align="center">
    <img alt="Static Badge" src="https://img.shields.io/badge/-Python_3.12-%23354D73?style=flat&logo=python&labelColor=%231C1C1C">
    <br>
    <img alt="Static Badge" src="https://img.shields.io/badge/-FastApi_0.112.2-%23009B77?style=flat&logo=fastapi&labelColor=%231C1C1C">
    <img alt="Static Badge" src="https://img.shields.io/badge/-SQLAlchemy_2.0.34-%23009B77?style=flat&logo=sqlalchemy&labelColor=%231C1C1C">
    <img alt="Static Badge" src="https://img.shields.io/badge/-Celery_5.4.0-%23009B77?style=flat&logo=celery&labelColor=%231C1C1C">
    <br>
    <img alt="Static Badge" src="https://img.shields.io/badge/-Redis_5.0.8-%23D53032?style=flat&logo=redis&labelColor=%231C1C1C">
    <img alt="Static Badge" src="https://img.shields.io/badge/-PyDantic_2.9.0-%23FF0033?style=flat&logo=pydantic&labelColor=%231C1C1C">
</div>

---

## Генерация токена
### *Приватного:*
```bash
openssl genrsa -out jwt-private.pem 2048 
```
### *Публичного:*
```bash
openssl rsa -in jwt-private.pem -outform PEM -pubout -out jwt-public.pem 
```

---

## Запуск:
### *App Backend:*
```bash
  uvicorn src.main:app --reload
```
### *App Frontend:* 
```bash
npm run dev
```
### *Celery:*
```bash
celery -A bg_task.setting:celery worker --loglevel=INFO --pool=solo
```
### *Flower:*
```bash
celery -A bg_task.config:celery flower --loglevel=info
```
### *Тесты:*
```bash
pytest -vv -s tests/test_auth.py::TestAuthPos 
```
# Ссылки:
* [App](http://localhost:5173)
* [Swagger](http://localhost:8000/docs)
* [Flower](http://localhost:5555/)
