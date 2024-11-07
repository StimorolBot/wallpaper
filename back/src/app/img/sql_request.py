from sqlalchemy import select, and_
from sqlalchemy.sql.selectable import Select

from src.app.auth.model import AuthTable
from src.app.img.model import ImgTable
from src.app.auth.token.jwt_token import jwt_token
from src.app.img.reaction.model import ReactionTable


async def get_info_about_img(access_token: str = None, *args, **filter_params: str) -> Select:
    if not access_token:
        return (
            select(
                ImgTable.img_base64,
                ImgTable.uuid_img,
                *args
            )
            .join_from(AuthTable, ImgTable)
            .filter_by(**filter_params)
        )

    user = jwt_token.decode(token=access_token)

    query = (
        select(
            ImgTable.img_base64,
            ImgTable.uuid_img,
            ReactionTable.reaction,
            *args
        )
        .join_from(AuthTable, ImgTable)
        .filter_by(**filter_params)
        .join(
            ReactionTable,
            and_(ReactionTable.uuid_img == ImgTable.uuid_img, ImgTable.uuid_user == user["sub"]),
            isouter=True
        )
    )

    return query
