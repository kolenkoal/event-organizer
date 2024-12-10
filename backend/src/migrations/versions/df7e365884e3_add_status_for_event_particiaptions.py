"""add status for event particiaptions

Revision ID: df7e365884e3
Revises: fcbbe20acad4
Create Date: 2024-12-10 21:36:41.902161

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'df7e365884e3'
down_revision: Union[str, None] = 'fcbbe20acad4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('event_participants', sa.Column('status', sa.Enum('PENDING', 'APPROVED', 'REJECTED', 'CANCELED', name='participantstatus'), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('event_participants', 'status')
    # ### end Alembic commands ###
