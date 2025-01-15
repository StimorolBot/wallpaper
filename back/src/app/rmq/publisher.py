from aio_pika import Message
from aio_pika.channel import Channel

from core.logger import rmq_logger
from src.app.rmq.config import settings
from src.app.rmq.config import get_connection


async def produce_msg(channel: Channel, msg: bytes):
    queue = await channel.declare_queue(settings.ROUTING_KEY)
    await channel.default_exchange.publish(Message(msg), routing_key=queue.name)
    rmq_logger.info("Сообщение: '%s' отправлено в очередь: %s", msg.decode(), queue)


async def publisher(msg: bytes):
    async with await get_connection() as connection:
        rmq_logger.info("Подключение: %s", connection)
        async with connection.channel() as channel:
            rmq_logger.info("Канал создан: %s", channel)
            await produce_msg(channel=channel, msg=msg)
