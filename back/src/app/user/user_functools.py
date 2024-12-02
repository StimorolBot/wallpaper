import os
import json
import base64
import aiofiles
from random import choice

from core.logger import os_logger

PATH = f"{os.path.dirname(os.path.abspath(__file__))}"


def create_avatar_json() -> dict:
    data_dict = {}
    for path, _, files in os.walk(f"{PATH}/.user_avatar"):
        for file in files:
            with open(f"{path}/{file}", mode="rb") as f:
                base64_file = base64.b64encode(f.read())
                data_dict[file] = base64_file.decode()
    return data_dict


async def save_file():
    data = create_avatar_json()
    json_data = json.dumps(data, indent=4)
    async with aiofiles.open(f"{PATH}/user_avatar.json", mode='w') as file:
        await file.write(json_data)
    os_logger.info("Файл user_avatar.json создан")


async def read_file_avatar() -> dict:
    try:
        async with aiofiles.open(f"{PATH}/user_avatar.json", mode='r') as file:
            contents = await file.read()
            return json.loads(contents)
    except FileNotFoundError:
        os_logger.warning("Не удалось найти файл user_avatar.json")
        await save_file()


async def get_avatar() -> str:
    try:
        data_dict = await read_file_avatar()
        name_img = choice(list(data_dict.keys()))
        return data_dict[name_img]
    except AttributeError:
        os_logger.warning("Повторный вызов функции get_avatar")
        return await get_avatar()
