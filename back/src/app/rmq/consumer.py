import asyncio
from aio_pika.channel import Channel
from aio_pika.abc import AbstractIncomingMessage

from core.logger import rmq_logger
from src.app.rmq.functools import subscribe_on_user
from src.app.rmq.config import get_connection, settings


async def callback(msg: AbstractIncomingMessage):
    rmq_logger.debug("Сообщение: %s получено", msg.body.decode())
    await subscribe_on_user(msg)


async def consume_msg(channel: Channel):
    # потребление сообщения
    queue = await channel.declare_queue(settings.ROUTING_KEY)
    await queue.consume(callback)


async def consumer():
    async with await get_connection() as connection:
        rmq_logger.debug("Подключение: %s", connection)
        async with connection.channel() as channel:
            while True:
                await consume_msg(channel)


if __name__ == '__main__':
    try:
        asyncio.run(consumer())
    except KeyboardInterrupt:
        rmq_logger.debug("Соединение закрыто")
