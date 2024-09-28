"""Added access token model

Revision ID: 1053f442c1aa
Revises: 5c03a3ead273
Create Date: 2024-09-15 16:43:19.471061

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from fastapi_users_db_sqlalchemy.generics import GUID

revision: str = '1053f442c1aa'
down_revision: Union[str, None] = '5c03a3ead273'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('access_tokens',
    sa.Column('user_id', GUID(), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('now()'), nullable=False),
    sa.Column('token', sa.String(length=43), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_access_tokens_user_id_users'), ondelete='cascade'),
    sa.PrimaryKeyConstraint('token', name=op.f('pk_access_tokens'))
    )


def downgrade() -> None:
    op.drop_table('access_tokens')
