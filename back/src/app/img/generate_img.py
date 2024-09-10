import json
import aiohttp
import requests
from asyncio import sleep

from src.app.img.config import settings
from src.app.img.style_img import StyleImg


class Text2ImageAPI:

    def __init__(self, url, api_key, secret_key):
        self.url = url
        self.auth_headers = {'X-Key': f'Key {api_key}', 'X-Secret': f'Secret {secret_key}'}

    async def get_model(self):
        async with aiohttp.ClientSession() as session:
            async with session.get(self.url + 'key/api/v1/models', headers=self.auth_headers) as response:
                data = await response.json()
                return data[0]['id']

    async def generate(
            self, prompt: str, model: int, style: StyleImg,
            width: int, height: int, images: int = 1
    ):
        params = {
            "type": "GENERATE",
            "style": style,
            "numImages": images,
            "width": width,
            "height": height,
            "generateParams": {
                "query": f"{prompt}"
            }
        }

        payload = {
            'model_id': (None, model),
            'params': (None, json.dumps(params), 'application/json')
        }
        response = requests.post(self.url + 'key/api/v1/text2image/run', headers=self.auth_headers, files=payload)
        data = response.json()

        #async with aiohttp.ClientSession() as session:
        #   async with session.post(
        #          self.url + 'key/api/v1/text2image/run',
        #         headers=self.auth_headers, files=payload
        #) as response:
        #   data = await response.json()
        #  print(data)
        # return data["uuid"]
        return data["uuid"]

    async def check_generation(self, request_id, attempts: int = 10, delay: int = 10):
        while attempts > 0:
            async with aiohttp.ClientSession() as session:
                async with session.get(
                        f"{self.url}key/api/v1/text2image/status/{request_id}", headers=self.auth_headers
                ) as response:
                    data = await response.json()

                    if data['status'] == 'DONE':
                        return data['images']

            attempts -= 1
            await sleep(delay)

    async def get_base64_img(self, prompt: str, style: StyleImg, width: int, height: int) -> str:
        model_id = await self.get_model()
        uuid = await self.generate(prompt=prompt, model=model_id, style=style, width=width, height=height)
        images = await self.check_generation(uuid)
        return images[0]


api = Text2ImageAPI(url=settings.BASE_URL, api_key=settings.API_KEY, secret_key=settings.SECRET_KEY)
