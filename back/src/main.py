from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_redoc_html, get_swagger_ui_html, get_swagger_ui_oauth2_redirect_html

from fastapi_pagination import add_pagination
from fastapi_cache.backends.redis import RedisBackend

from src.app.redis.config import redis, fast_api_cache
from src.app.img.router import img_router
from src.app.auth.router import register_router
from src.app.auth.token.router import jwt_router
from src.app.user.router import user_router
from src.app.img.tag.router import tag_router

@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    fast_api_cache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield

app = FastAPI(title="wallpaper", lifespan=lifespan, docs_url=None, redoc_url=None)
add_pagination(app)

app.include_router(img_router)
app.include_router(register_router)
app.include_router(jwt_router)
app.include_router(user_router)
app.include_router(tag_router)

add_pagination(app)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:80",
    "http://127.0.0.1:80",
    "http://127.0.0.1"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "DELETE", "PATCH", "PUT"],
    allow_headers=[
        "Content-Type", "Set-Cookie", "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin", "Authorization"
    ]
)


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        oauth2_redirect_url=app.swagger_ui_oauth2_redirect_url,
        swagger_js_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js",
        swagger_css_url="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css",
    )


@app.get(app.swagger_ui_oauth2_redirect_url, include_in_schema=False)
async def swagger_ui_redirect():
    return get_swagger_ui_oauth2_redirect_html()


@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_js_url="https://unpkg.com/redoc@next/bundles/redoc.standalone.js",
    )
