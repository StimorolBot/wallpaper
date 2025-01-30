from fastapi import status, HTTPException
from pydantic import BaseModel, ConfigDict, Field, field_validator

from core.validator import ValidUuid, ValidName
from src.app.redis.operation_type import Operation


class ActionRequestSchema(BaseModel):
    uuid_user: ValidUuid
    user_name: ValidName
    operation: Operation

    # extra="forbid" - запрещает передавать поля, которых нет в схеме
    model_config = ConfigDict(from_attributes=True)


class AddUserSchema(BaseModel):
    is_add: bool
    subscriber_uuid: ValidUuid


class ChangeAvatarSchema(BaseModel):
    img_size: int = Field(le=2500000)
    content_type: str

    @field_validator("content_type")
    @classmethod
    def check_content_type(cls, value: str):
        if value.split("/")[0] != "image":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неверный формат файла")
