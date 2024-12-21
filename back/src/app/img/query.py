from sqlalchemy import select, func, case, and_
from sqlalchemy.sql.selectable import Select, Subquery

from src.app.img.model import ImgTable
from src.app.img.tag.model import TagTable, TagBufferTable
from src.app.auth.token.jwt_token import jwt_token
from src.app.img.reaction.model import ReactionTable


def select_tag_subquery() -> Subquery:
    return (
        select(func.array_agg(TagTable.tag).label("img_tag"))
        .select_from(TagTable)
        .where(TagBufferTable.tag_id == TagTable.id)
        .subquery("img_tag_subquery")
    )


def base_select(is_public, *args, **filter_kwargs):
    img_tag_subquery = select_tag_subquery()
    return (
        select(
            ImgTable.uuid_img,
            ImgTable.img_base64,
            img_tag_subquery,
            ImgTable.create_date,
            func.count(case((ReactionTable.reaction == True, ""))).label("like_count"),
            func.count(case((ReactionTable.reaction == False, ""))).label("dislike_count"),
            *args
        )
        .distinct()
        .select_from(ImgTable)
        .filter_by(is_public=is_public, **filter_kwargs)
        .join(ReactionTable, ImgTable.uuid_img == ReactionTable.uuid_img, isouter=True)
        .group_by(ImgTable.uuid_img, img_tag_subquery, ImgTable.create_date, ImgTable.img_base64)
    )


def check_reaction(uuid: str, reaction: bool = True, label: str = "is_like"):
    return (
        func.count(
            case((and_(ReactionTable.reaction == reaction, ReactionTable.uuid_user == uuid), 1))
        ).label(label))


def get_info_about_img(access_token=None, is_public: bool = True, *args, **filter_kwargs) -> Select:
    if not access_token:
        return base_select(is_public, *args, **filter_kwargs)

    user = jwt_token.decode(access_token)
    is_like = check_reaction(user["sub"])
    is_dislike = check_reaction(user["sub"], False, "is_dislike")

    return base_select(is_public, is_like, is_dislike, *args, **filter_kwargs)
