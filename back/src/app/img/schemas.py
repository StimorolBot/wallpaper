from datetime import datetime
from pydantic import BaseModel, Field

from core.validator import ValidSizeImg, ValidPromptImg, ValidUuid, ValidName
from src.app.img.enums.style_img import StyleImg


class ImageSchemas(BaseModel):
    prompt: ValidPromptImg
    negative_prompt: ValidPromptImg | None = None
    style: StyleImg
    width: ValidSizeImg
    height: ValidSizeImg
    is_public: bool = False


class AllImageDTO(BaseModel):
    img_base64: str
    uuid_img: ValidUuid
    img_tag: list[int | str]
    dislike_count: int = Field(default=0, ge=0)
    like_count: int = Field(default=0, ge=0)
    is_like: int = Field(default=0, ge=0)
    is_dislike: int = Field(default=0, ge=0)


class AboutImgDTO(AllImageDTO):
    avatar_user: str
    user_name: ValidName
    uuid_user: ValidUuid
    img_tag: list[str]
    style: StyleImg
    create_date: datetime
    prompt: ValidPromptImg
    negative_prompt: ValidPromptImg | None


class PublishSchemas(BaseModel):
    uuid_img: ValidUuid
