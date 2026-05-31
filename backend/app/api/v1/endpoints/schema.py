from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.api.dependencies.auth_dependency import (
    get_current_user
)

from app.models.database_connection import (
    DatabaseConnection
)

from app.services.schema_service import (
    SchemaService
)

from app.utils.response import success_response


router = APIRouter(
    prefix="/schema",
    tags=["Schema"]
)


@router.post("/extract/{connection_id}")
def extract_schema(
    connection_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    connection = db.query(
        DatabaseConnection
    ).filter(
        DatabaseConnection.id == connection_id,
        DatabaseConnection.user_id == current_user.id
    ).first()

    if not connection:
        raise HTTPException(
            status_code=404,
            detail="Database connection not found"
        )

    result = SchemaService.extract_schema(
        db,
        connection
    )

    return success_response(
        message="Schema extracted successfully",
        data=result
    )