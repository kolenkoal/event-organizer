"""Add artifacts

Revision ID: fcbbe20acad4
Revises: 5c47071d8ba5
Create Date: 2024-12-10 21:14:39.086150

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'fcbbe20acad4'
down_revision: Union[str, None] = '5c47071d8ba5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event_participants', sa.Column('artifacts', sa.ARRAY(sa.String()), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('event_participants', 'artifacts')
    # ### end Alembic commands ###
