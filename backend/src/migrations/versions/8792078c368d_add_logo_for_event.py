"""Add logo for event

Revision ID: 8792078c368d
Revises: be390edda070
Create Date: 2025-01-04 19:53:40.656848

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '8792078c368d'
down_revision: Union[str, None] = 'be390edda070'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('logo_url', sa.String(length=1024), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('events', 'logo_url')
    # ### end Alembic commands ###
