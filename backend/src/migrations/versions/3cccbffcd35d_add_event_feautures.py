"""Add event feautures

Revision ID: 3cccbffcd35d
Revises: 23840c5cb367
Create Date: 2024-12-09 21:20:25.599581

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '3cccbffcd35d'
down_revision: Union[str, None] = '23840c5cb367'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('events', sa.Column('parent_event_id', sa.UUID(), nullable=True))
    op.create_foreign_key(op.f('fk_events_parent_event_id_events'), 'events', 'events', ['parent_event_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(op.f('fk_events_parent_event_id_events'), 'events', type_='foreignkey')
    op.drop_column('events', 'parent_event_id')
    # ### end Alembic commands ###
