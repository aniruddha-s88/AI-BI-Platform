from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Text
)

from sqlalchemy.orm import relationship

from app.db.base import Base


class SchemaMetadata(Base):

    __tablename__ = "schema_metadata"

    id = Column(Integer, primary_key=True, index=True)

    connection_id = Column(
        Integer,
        ForeignKey("database_connections.id")
    )

    table_name = Column(String)

    column_name = Column(String)

    data_type = Column(String)

    connection = relationship(
        "DatabaseConnection",
        back_populates="schema_metadata"
    )