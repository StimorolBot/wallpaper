from pydantic import BaseModel

from core.validator import ValidUuid
from src.app.img.enums.operation_type import Operation


class ReactionSchemas(BaseModel):
    reaction: bool
    img_uuid: ValidUuid
    operation_type: Operation
