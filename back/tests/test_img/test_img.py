import pytest
from fastapi import status
from httpx import AsyncClient

from tests.conftest import ac
from core.help import get_redis
from src.app.img.enums.style_img import StyleImg


class TestImgPos:

    async def test_get_home_page(self, ac: AsyncClient):
        token = await get_redis("img_token_test")
        response = await ac.get("/", cookies={"access_token": token["access_token"]})
        assert response.status_code == status.HTTP_200_OK

    async def test_get_home_page_no_cookies(self, ac: AsyncClient):
        response = await ac.get("/")
        assert response.status_code == status.HTTP_200_OK

    async def test_get_popular_img(self, ac: AsyncClient):
        ...

    async def test_create_img(self, ac: AsyncClient):
        token = await get_redis("img_token_test")
        data = {
            "prompt": "тест",
            "style": StyleImg.ANIME.value,
            "width": 1000,
            "height": 500
        }

        response = await ac.post("/create", json=data, cookies={"access_token": token["access_token"]})
        assert response.status_code == status.HTTP_201_CREATED

    async def test_get_img_by_uuid(self, ac: AsyncClient):
        ...

    async def test_set_reaction(self, ac: AsyncClient):
        ...


class TestImgNeg:
    @pytest.mark.parametrize("path", ("/test", "/auth/test", "/popular/test"))
    async def test_page_not_found(self, ac: AsyncClient, path: str):
        response = await ac.get(url=path)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    async def test_create_img_no_cookies(self, ac: AsyncClient):
        data = {
            "prompt": "тест",
            "style": StyleImg.ANIME.value,
            "width": 1000,
            "height": 500
        }
        response = await ac.post("/create", json=data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.parametrize(
        "prompt, style, width, height",
        [(" ", "ANIME", 200, 200),
         ("test", " ", 200, 200),

         ("test", "ANIME", -200, 200),
         ("test", "ANIME", 200, -200),

         ("test", "ANIME", 2000, 200),
         ("test", "ANIME", 200, 2000),

         ("p", "ANIME", 200, 200),
         ("test", "TEST_STYLE", 200, 200),
         ("test ! @ + - / . | \\", "ANIME", 200, 200)]
    )
    async def test_create_img_bad_request(
            self, ac: AsyncClient,
            prompt: str, style: str,
            width: int, height: int
    ):
        token = await get_redis("img_token_test")
        data = {
            "prompt": prompt,
            "style": style,
            "width": width,
            "height": height
        }

        response = await ac.post("/create", json=data, cookies={"access_token": token["access_token"]})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
