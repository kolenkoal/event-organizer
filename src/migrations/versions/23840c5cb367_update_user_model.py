"""Update user model

Revision ID: 23840c5cb367
Revises: 5c4df5a2b349
Create Date: 2024-11-17 10:09:15.490423

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '23840c5cb367'
down_revision: Union[str, None] = '5c4df5a2b349'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('external_id', sa.Integer(), nullable=True))
    op.alter_column('users', 'first_name',
               existing_type=sa.VARCHAR(length=256),
               nullable=True)
    op.alter_column('users', 'last_name',
               existing_type=sa.VARCHAR(length=256),
               nullable=True)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'last_name',
               existing_type=sa.VARCHAR(length=256),
               nullable=False)
    op.alter_column('users', 'first_name',
               existing_type=sa.VARCHAR(length=256),
               nullable=False)
    op.drop_column('users', 'external_id')
    # ### end Alembic commands ###