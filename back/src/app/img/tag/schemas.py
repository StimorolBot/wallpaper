from pydantic import BaseModel, Field
from core.validator import ValidUuid


class TagSchemas(BaseModel):
    uuid_img: ValidUuid
    tag_list: list[str] | None
    is_automatically: bool


class PopularTagDTO(BaseModel):
    value: int = Field(default=1, ge=0)
    label: str

