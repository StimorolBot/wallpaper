import json

from src.app.redis.config import redis


async def get_redis(key) -> dict | None:
    data_dict = await redis.get(key)
    if not data_dict:
        return None
    return json.loads(data_dict)


async def set_redis(name, value: dict, ex: int | None = 2):
    value_str = json.dumps(value)
    await redis.set(name=name, value=value_str, ex=ex, nx=True)


async def del_redis(name: str):
    await redis.delete(name)
