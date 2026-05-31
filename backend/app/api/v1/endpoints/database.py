from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.database_schema import (
    DatabaseConnectionCreate
)

from app.services.database_service import (
    DatabaseService
)

from app.models.database_connection import (
    DatabaseConnection
)

from app.utils.response import success_response

from app.api.dependencies.auth_dependency import (
    get_current_user
)


router = APIRouter(
    prefix="/database",
    tags=["Database"]
)


@router.get("/connections")
def list_connections(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    connections = db.query(DatabaseConnection).filter(
        DatabaseConnection.user_id == current_user.id
    ).all()

    return success_response(
        message="Connections fetched successfully",
        data=[
            {
                "id": connection.id,
                "db_type": connection.db_type,
                "database_name": connection.database_name,
                "host": connection.host,
                "port": connection.port
            }
            for connection in connections
        ]
    )


@router.post("/connect")
def connect_database(
    payload: DatabaseConnectionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    connection = DatabaseService.save_connection(
        db=db,
        user_id=current_user.id,
        payload=payload
    )

    return success_response(
        message="Database connected successfully",
        data={
            "connection_id": connection.id,
            "database_name": connection.database_name,
            "db_type": connection.db_type
        }
    )
