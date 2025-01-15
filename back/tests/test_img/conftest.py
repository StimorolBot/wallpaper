import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from core.crud import crud
from src.app.redis.redis_func import set_redis

from src.app.auth.model import AuthTable
from src.app.auth.password_auth import password_auth

from src.app.img.model import ImgTable
from src.app.user.model import UserTable
from src.app.img.enums.style_img import StyleImg

from tests.conftest import ac
from tests.conftest import async_session_maker

TEST_USER_EMAIL = "user1@example.com"
TEST_UUID_USER = "cefd9c16ebfa4f2f8ddee913f9aa8520"


async def create_img(session: AsyncSession):
    data = {
        "uuid_user": TEST_UUID_USER,
        "uuid_img": "a4c687d2dde54c1aa39385d23f2fcc9d",
        "style": StyleImg.ANIME.value,
        "prompt": "hello word!",
        "img_base64": "/9j/4AAQSkZJRgABAQAAAQABAAD...KXFFACUtFFAH/9k=",
        "is_public": True
    }

    await crud.create(session=session, table=ImgTable, data=data)


async def set_info_user(session: AsyncSession):
    data = {
        "uuid_user": TEST_UUID_USER,
        "avatar_user": "/9j/4AAQSkZJRgABAQAAAQABAAD..."
    }
    await crud.create(session=session, table=UserTable, data=data)


@pytest.fixture(autouse=True, scope="module")
async def create_user():
    data = {
        "uuid_user": TEST_UUID_USER,
        "email": TEST_USER_EMAIL,
        "user_name": "username",
        "hash_password": password_auth.get_hash_password("password123")
    }
    async with async_session_maker() as session:
        await crud.create(session=session, table=AuthTable, data=data)
        await create_img(session)
        await set_info_user(session)


@pytest.fixture(autouse=True, scope="module")
async def login(ac: AsyncClient):
    user_data = {"email": TEST_USER_EMAIL, "password": "password123"}
    response = await ac.post("/auth/login", json=user_data)

    token = response.json()
    await set_redis(name="img_token_test", value={"access_token": token["access_token"]}, ex=120)
