from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text
)

from datetime import datetime

from app.db.base import Base


class QueryHistory(Base):

    __tablename__ = "query_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    connection_id = Column(
        Integer,
        ForeignKey("database_connections.id")
    )

    question = Column(Text)

    generated_sql = Column(Text)

    chart_type = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )