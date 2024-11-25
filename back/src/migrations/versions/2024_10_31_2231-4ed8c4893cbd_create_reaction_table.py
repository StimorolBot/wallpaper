"""create_reaction_table

Revision ID: 4ed8c4893cbd
Revises: b5c94f76b2f3
Create Date: 2024-10-31 22:31:23.180596

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4ed8c4893cbd"
down_revision: Union[str, None] = "b5c94f76b2f3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "reaction_table",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("uuid_user", sa.String(), nullable=False),
        sa.Column("uuid_img", sa.String(), nullable=False),
        sa.Column("reaction", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["uuid_img"],
            ["img_table.uuid_img"],
        ),
        sa.ForeignKeyConstraint(
            ["uuid_user"],
            ["auth_table.uuid_user"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("reaction_table")
    # ### end Alembic commands ###
