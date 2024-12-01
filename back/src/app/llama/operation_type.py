from enum import Enum


class Operation(Enum):
    CREATE_TAG = (
        "create eight tags for the image and list them in order on one line, without hyphens,"
        "each new tag starts with the # symbol, the length of the tag must be from one to twenty-five characters, "
        "no additional explanations for the tags are required"
    )
