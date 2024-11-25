from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "b5c94f76b2f3"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "auth_table",
        sa.Column("uuid_user", sa.String(), nullable=False),
        sa.Column("user_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("hash_password", sa.String(), nullable=False),
        sa.Column(
            "date_register",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("is_active", sa.Boolean(), nullable=False),
        sa.Column("is_superuser", sa.Boolean(), nullable=False),
        sa.Column("is_verified", sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint("uuid_user"),
    )
    op.create_index(
        op.f("ix_auth_table_email"), "auth_table", ["email"], unique=True
    )
    op.create_table(
        "img_table",
        sa.Column("uuid_img", sa.String(), nullable=False),
        sa.Column("uuid_user", sa.String(), nullable=False),
        sa.Column("style", sa.String(), nullable=False),
        sa.Column(
            "create_date",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column("prompt", sa.String(), nullable=False),
        sa.Column("img_base64", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["uuid_user"],
            ["auth_table.uuid_user"],
        ),
        sa.PrimaryKeyConstraint("uuid_img"),
    )
    op.create_index(
        op.f("ix_img_table_uuid_img"), "img_table", ["uuid_img"], unique=True
    )

def downgrade() -> None:
    op.drop_index(op.f("ix_img_table_uuid_img"), table_name="img_table")
    op.drop_table("img_table")
    op.drop_index(op.f("ix_auth_table_email"), table_name="auth_table")
    op.drop_table("auth_table")
