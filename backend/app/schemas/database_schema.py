from pydantic import BaseModel


class DatabaseConnectionCreate(BaseModel):

    db_type: str

    host: str

    port: str

    username: str

    password: str

    database_name: str