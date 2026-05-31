from sqlalchemy import create_engine, inspect

from app.models.schema_metadata import (
    SchemaMetadata
)

from app.repositories.schema_repository import (
    SchemaRepository
)


class SchemaService:

    @staticmethod
    def extract_schema(
        db,
        connection
    ):

        database_url = (
            f"postgresql://{connection.username}:"
            f"{connection.password}@"
            f"{connection.host}:"
            f"{connection.port}/"
            f"{connection.database_name}"
        )

        engine = create_engine(database_url)

        inspector = inspect(engine)

        tables = inspector.get_table_names()

        metadata_objects = []

        for table in tables:

            columns = inspector.get_columns(table)

            for column in columns:

                metadata_objects.append(
                    SchemaMetadata(
                        connection_id=connection.id,
                        table_name=table,
                        column_name=column["name"],
                        data_type=str(column["type"])
                    )
                )

        SchemaRepository.save_schema_metadata(
            db,
            metadata_objects
        )

        return {
            "tables_scanned": len(tables),
            "columns_saved": len(metadata_objects)
        }