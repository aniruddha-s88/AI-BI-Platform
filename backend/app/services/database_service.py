from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError

from fastapi import status

from app.core.exceptions import AppException

from app.repositories.database_respository import (
    DatabaseRepository
)


class DatabaseService:

    @staticmethod
    def test_connection(
        db_type,
        host,
        port,
        username,
        password,
        database_name
    ):

        try:

            if db_type == "postgresql":

                database_url = (
                    f"postgresql://{username}:"
                    f"{password}@{host}:"
                    f"{port}/{database_name}"
                )

            else:
                raise AppException(
                    status_code=400,
                    message="Unsupported database type"
                )

            engine = create_engine(database_url)

            connection = engine.connect()

            connection.close()

            return True

        except SQLAlchemyError:

            raise AppException(
                status_code=status.HTTP_400_BAD_REQUEST,
                message="Database connection failed"
            )

    @staticmethod
    def save_connection(
        db,
        user_id,
        payload
    ):

        DatabaseService.test_connection(
            payload.db_type,
            payload.host,
            payload.port,
            payload.username,
            payload.password,
            payload.database_name
        )

        connection_data = {
            "user_id": user_id,
            "db_type": payload.db_type,
            "host": payload.host,
            "port": payload.port,
            "username": payload.username,
            "password": payload.password,
            "database_name": payload.database_name
        }

        return DatabaseRepository.create_connection(
            db,
            connection_data
        )