from redis import asyncio as aioredis

redis = aioredis.Redis(host='localhost', port=6379, decode_responses=True, encoding="utf-8")
