from uuid import uuid4


def generate_uuid() -> str:
    return uuid4().hex


def create_dict(list_key: list, list_value: list) -> dict:
    return dict(zip(list_key, list_value))


def get_item(main_list) -> list:
    return [item for items in main_list for item in items]
