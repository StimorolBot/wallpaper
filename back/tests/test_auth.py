import pytest
from fastapi import status
from tests.conftest import ac
from httpx import AsyncClient
from core.help import set_redis, get_redis


class TestAuthPos:

    async def test_get_code_confirm(self, ac: AsyncClient):
        user_data = {"email": "user@example.com"}
        response = await ac.post("/auth/get-code", json=user_data)
        assert response.status_code == status.HTTP_200_OK

    async def test_register(self, ac: AsyncClient):
        code = await get_redis(key="user@example.com")
        user_data = {
            "email": "user@example.com",
            "user_name": "string123",
            "password": "string123",
            "code_confirm": code["code"]
        }
        response = await ac.post("/auth/register", json=user_data)
        assert response.status_code == status.HTTP_201_CREATED

    async def test_login(self, ac: AsyncClient):
        user_data = {"email": "user@example.com", "password": "string123"}
        response = await ac.post("/auth/login", json=user_data)

        token = response.json()
        await set_redis(
            name="token_test",
            value={"access_token": token["access_token"]}
        )
        assert response.status_code == status.HTTP_200_OK

    async def test_reset_password(self, ac: AsyncClient):
        ...

    async def test_logout(self, ac: AsyncClient):
        token = await get_redis("token_test")
        response = await ac.patch("/auth/logout", cookies={"access_token": token["access_token"]})
        assert response.status_code == status.HTTP_200_OK


class TestAuthNeg:
    @pytest.mark.parametrize(
        "email, password, user_name",
        [(" ", "string123", "user_name"),
         ("user@example.com", " ", "user_name"),
         ("user@example.com", "string123", " "),

         ("Email", "string123", "user_name"),
         ("user@example.com", "str1", "user_name"),
         ("user@example.com", "string123", "Un"),

         ("'user@example.com!#'", "string123", "user_name"),
         ("user@example.com", "'string(1){2}3'", "user_name"),
         ("user@example.com", "string123", "[user&name]"),

         ("user_user_user_user_user_user@example.com", "string123", "user_name"),
         ("user@example.com", "string123string123string123string123string123string123", "user_name"),
         ("user@example.com", "string123", "user_name_user_name_user_name"),
         ("user@examp@le.com", "string123", "user_name"),
         ("user.examp@le.com", "string123", "user_name")]
    )
    async def test_register(self, ac: AsyncClient, email, password, user_name):
        await set_redis(name=email, value={"code": "test"}, ex=4)
        user_data = {"email": email, "password": password, "user_name": user_name, "code_confirm": "test"}
        response = await ac.post("/auth/register", json=user_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    async def test_login(self, ac: AsyncClient):
        user_data = {"email": "fake_email@mail.com", "password": "fake_password"}
        response = await ac.post("/auth/login", json=user_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    async def test_logout(self, ac: AsyncClient):
        response = await ac.post("/auth/logout", cookies={"access_token": ""})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
