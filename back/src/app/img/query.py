from sqlalchemy import select, func, case, and_
from sqlalchemy.sql.selectable import Select, Subquery

from src.app.img.model import ImgTable
from src.app.img.tag.model import TagTable, TagBufferTable
from src.app.auth.token.jwt_token import jwt_token
from src.app.img.reaction.model import ReactionTable


def select_tag_subquery(is_multi: bool) -> Subquery:
    if is_multi:
        return (
            select(func.array_agg(TagBufferTable.tag_id).label("img_tag"), TagBufferTable.uuid_img)
            .select_from(TagBufferTable)
            .group_by(TagBufferTable.uuid_img)
            .subquery("img_tag_subquery")
        )
    return (
        select(func.array_agg(TagTable.tag).label("img_tag"), TagBufferTable.uuid_img)
        .select_from(TagTable)
        .where(TagBufferTable.tag_id == TagTable.id)
        .group_by(TagBufferTable.uuid_img)
        .subquery("img_tag_subquery")
    )


def base_select(is_public: bool, is_multi: bool, *args, **filter_kwargs):
    img_tag_subquery = select_tag_subquery(is_multi)
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
        .join(img_tag_subquery, img_tag_subquery.c.uuid_img == ImgTable.uuid_img)
        .group_by(ImgTable.uuid_img, img_tag_subquery, ImgTable.create_date, ImgTable.img_base64)
    )


def check_reaction(uuid: str, reaction: bool = True, label: str = "is_like"):
    return (
        func.count(
            case((and_(ReactionTable.reaction == reaction, ReactionTable.uuid_user == uuid), 1))
        ).label(label))


def get_info_about_img(
        access_token: str, is_public: bool,
        is_multi: bool, *args, **filter_kwargs
) -> Select:
    if not access_token:
        return base_select(is_public, is_multi, *args, **filter_kwargs)

    user = jwt_token.decode(access_token)
    is_like = check_reaction(user["sub"])
    is_dislike = check_reaction(user["sub"], False, "is_dislike")

    return base_select(is_public, is_multi, is_like, is_dislike, *args, **filter_kwargs)
