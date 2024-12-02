from ollama import ChatResponse, AsyncClient

from src.app.llama.config import settings
from src.app.llama.ollama_helper import Operation


async def ollama_helper(img: str, operation: Operation) -> str:
    tags: ChatResponse = await AsyncClient().chat(
        model=settings.llava,
        messages=[
            {
                "role": "user",
                "content": operation.value,
                "images": [img]
            }
        ]
    )
    return tags.message.content
