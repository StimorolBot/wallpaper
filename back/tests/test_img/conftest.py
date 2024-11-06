import pytest
from httpx import AsyncClient

from core.crud import crud
from core.my_functools import set_redis

from src.app.auth.model import AuthTable
from src.app.auth.password_auth import password_auth

from tests.conftest import ac
from tests.conftest import async_session_maker

TEST_USER_EMAIL = "user1@example.com"


@pytest.fixture(autouse=True, scope="module")
async def add_record_in_database():
    data = {
        "email": TEST_USER_EMAIL,
        "user_name": "username",
        "hash_password": password_auth.get_hash_password("password123")
    }
    async with async_session_maker() as session:
        await crud.create(session=session, table=AuthTable, data=data)


@pytest.fixture(autouse=True, scope="module")
async def login(ac: AsyncClient):
    user_data = {"email": TEST_USER_EMAIL, "password": "password123"}
    response = await ac.post("/auth/login", json=user_data)

    token = response.json()
    await set_redis(
        name="img_token_test",
        value={"access_token": token["access_token"]},
        ex=120
    )
