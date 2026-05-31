from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime,
    
)
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class DatabaseConnection(Base):

    __tablename__ = "database_connections"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    db_type = Column(
        String,
        nullable=False
    )

    host = Column(String)

    port = Column(String)

    username = Column(String)

    password = Column(String)

    database_name = Column(String)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    schema_metadata = relationship(
    "SchemaMetadata",
    back_populates="connection"
)