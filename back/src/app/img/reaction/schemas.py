from pydantic import BaseModel


class ReactionSchemas(BaseModel):
    reaction: bool
    img_uuid: str
