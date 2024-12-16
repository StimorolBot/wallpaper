import pytest
from fastapi import status
from httpx import AsyncClient

from tests.conftest import ac
from src.redis.redis_func import get_redis

from src.app.img.enums.style_img import StyleImg
from src.app.img.enums.filter_time import FilterTime


class TestImgPos:

    async def test_get_home_page(self, ac: AsyncClient):
        token = await get_redis("img_token_test")
        response = await ac.get("/", cookies={"access_token": token["access_token"]})
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize(
        "filter_time",
        (
                FilterTime.HOUR.value, FilterTime.DAY.value,
                FilterTime.WEEK.value, FilterTime.MONTH.value,
                FilterTime.YEAR.value, FilterTime.ALL.value
        )
    )
    async def test_get_popular_img(self, ac: AsyncClient, filter_time: str):
        token = await get_redis("img_token_test")
        response = await ac.get(
            "/popular",
            params={"filter_time": filter_time},
            cookies={"access_token": token["access_token"]}
        )
        assert response.status_code == status.HTTP_200_OK

    async def test_get_img_by_uuid(self, ac: AsyncClient):
        token = await get_redis("img_token_test")
        response = await ac.get(
            "/wallpaper/a4c687d2dde54c1aa39385d23f2fcc9d",
            params={"uuid_img": "a4c687d2dde54c1aa39385d23f2fcc9d"},
            cookies={"access_token": token["access_token"]}
        )
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize("reaction", (True, False))
    async def test_set_reaction(self, ac: AsyncClient, reaction):
        data = {"reaction": reaction, "img_uuid": "a4c687d2dde54c1aa39385d23f2fcc9d"}
        token = await get_redis("img_token_test")
        response = await ac.post(
            "set-reaction",
            json=data,
            cookies={"access_token": token["access_token"]}
        )
        assert response.status_code == status.HTTP_200_OK

    async def test_create_img(self, ac: AsyncClient):
        token = await get_redis("img_token_test")
        data = {"prompt": "тест", "style": StyleImg.ANIME.value}
        response = await ac.post("/create", json=data, cookies={"access_token": token["access_token"]})
        assert response.status_code == status.HTTP_201_CREATED


class TestImgNeg:

    @pytest.mark.parametrize("path", ("/test", "/auth/test", "/popular/test"))
    async def test_page(self, ac: AsyncClient, path: str):
        response = await ac.get(url=path)
        assert response.status_code == status.HTTP_404_NOT_FOUND

    @pytest.mark.parametrize(
        "prompt, style, width, height",
        [
            (" ", "ANIME", 1024, 1024),
            ("test1", "CYBERPUNK", 1024, 1024),
            ("test1", " ", 1024, 1024),
            ("test1", "ANIME", -1024, 1024),
            ("test1", "ANIME", 1024, -1024),
            ("test1", "ANIME", 543, 1024),
            ("test1", "ANIME", 1024, 543),
            ("test1", "ANIME", 2000, 1024),
            ("test1", "ANIME", 1024, 2000),
            ("test ! @ + - / . | \\", "ANIME", 1024, 1024)
        ]
    )
    async def test_create_img(self, ac: AsyncClient, prompt: str, style: str, width: int, height: int):
        token = await get_redis("img_token_test")
        data = {"prompt": prompt, "style": style, "width": width, "height": height}
        response = await ac.post("/create", json=data, cookies={"access_token": token["access_token"]})

        if response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
            assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
        else:
            assert response.status_code == status.HTTP_400_BAD_REQUEST

    @pytest.mark.parametrize("filter_time", (" ", "ANY"))
    async def test_get_popular_img(self, ac: AsyncClient, filter_time: str):
        response = await ac.get("/popular", params={"filter_time": filter_time})
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestImgPosNoCookies:

    async def test_get_home_page(self, ac: AsyncClient):
        response = await ac.get("/")
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize(
        "filter_time",
        (
                FilterTime.HOUR.value, FilterTime.DAY.value,
                FilterTime.WEEK.value, FilterTime.MONTH.value,
                FilterTime.YEAR.value, FilterTime.ALL.value
        )
    )
    async def test_get_popular_img_no_cookies(self, ac: AsyncClient, filter_time: str):
        response = await ac.get("/popular", params={"filter_time": filter_time})
        assert response.status_code == status.HTTP_200_OK

    async def test_get_img_by_uuid(self, ac: AsyncClient):
        response = await ac.get(
            "/wallpaper/a4c687d2dde54c1aa39385d23f2fcc9d",
            params={"uuid_img": "a4c687d2dde54c1aa39385d23f2fcc9d"})
        assert response.status_code == status.HTTP_200_OK


class TestImgNegNoCookies:

    async def test_create_img_no_cookies(self, ac: AsyncClient):
        data = {"prompt": "тест1", "style": StyleImg.ANIME.value}
        response = await ac.post("/create", json=data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    async def test_set_reaction(self, ac: AsyncClient):
        data = {"reaction": True, "img_uuid": "a4c687d2dde54c1aa39385d23f2fcc9d"}
        response = await ac.post("set-reaction", json=data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
