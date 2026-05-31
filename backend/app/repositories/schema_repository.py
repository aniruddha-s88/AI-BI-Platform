from app.models.schema_metadata import (
    SchemaMetadata
)


class SchemaRepository:

    @staticmethod
    def save_schema_metadata(
        db,
        metadata_list
    ):

        db.bulk_save_objects(metadata_list)

        db.commit()