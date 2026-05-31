from app.models.database_connection import (
    DatabaseConnection
)


class DatabaseRepository:

    @staticmethod
    def create_connection(
        db,
        connection_data
    ):

        db_connection = DatabaseConnection(
            **connection_data
        )

        db.add(db_connection)

        db.commit()

        db.refresh(db_connection)

        return db_connection