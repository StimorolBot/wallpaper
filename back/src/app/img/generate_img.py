import json
import requests
from asyncio import sleep
from httpx import AsyncClient
from fastapi import status, HTTPException

from core.logger import img_logger
from src.app.img.config import settings
from src.app.img.enums.style_img import StyleImg


class Text2ImageAPI:

    def __init__(self, url, api_key, secret_key):
        self.url = url
        self.auth_headers = {"X-Key": f"Key {api_key}", "X-Secret": f"Secret {secret_key}"}

    async def get_model(self):
        async with AsyncClient() as client:
            response = await client.get(f"{self.url}key/api/v1/models", headers=self.auth_headers)
            data = response.json()
            return data[0]['id']

    async def generate(
            self, prompt: str, model: int, style: StyleImg,
            width: int, height: int, images: int = 1
    ):
        # переписать на httpx или aiohttp
        params = {
            "type": "GENERATE",
            "style": style,
            "numImages": images,
            "width": width,
            "height": height,
            "generateParams": {
                "query": prompt
            }
        }

        payload = {
            'model_id': (None, model),
            'params': (None, json.dumps(params), 'application/json')
        }
        response = requests.post(
            f"{self.url}key/api/v1/text2image/run",
            headers=self.auth_headers, files=payload
        )

        data = response.json()
        try:
            return data["uuid"]
        except KeyError:
            img_logger.error("Не удалось сгенерировать изображение.\n Response: %s", data)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Не удалось сгенерировать изображение, пожалуйста повторите попытку позже"
            )

    async def check_generation(self, request_id, attempts: int = 10, delay: int = 10):
        while attempts > 0:
            async with AsyncClient() as client:
                response = await client.get(
                    f"{self.url}key/api/v1/text2image/status/{request_id}",
                    headers=self.auth_headers
                )
                data = response.json()

                if data['status'] == 'DONE':
                    return data['images']

            attempts -= 1
            await sleep(delay)

    async def get_base64_img(self, prompt: str, style: StyleImg, width: int, height: int) -> str:
        model_id = await self.get_model()
        uuid = await self.generate(prompt=prompt, model=model_id, style=style, width=width, height=height)
        images = await self.check_generation(uuid)
        try:
            return images[0]
        except TypeError:
            img_logger.error("Не удалось сгенерировать изображение.\n images->: %s", images)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Не удалось сгенерировать изображение, пожалуйста повторите попытку позже"
            )


api = Text2ImageAPI(url=settings.BASE_URL, api_key=settings.API_KEY, secret_key=settings.SECRET_KEY)
