from pydantic import BaseModel, ConfigDict

from core.validator import ValidUuid, ValidName
from src.app.redis.operation_type import Operation


class ActionRequest(BaseModel):
    uuid_user: ValidUuid
    user_name: ValidName
    operation: Operation

    # extra="forbid" - запрещает передавать поля, которых нет в схеме
    model_config = ConfigDict(from_attributes=True)


class AddUserSchema(BaseModel):
    is_add: bool
    subscriber_uuid: ValidUuid
