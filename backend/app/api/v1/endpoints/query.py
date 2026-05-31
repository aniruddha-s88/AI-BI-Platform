from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.query_schema import (
    QueryRequest
)

from app.services.query_service import (
    QueryService
)

from app.api.dependencies.auth_dependency import (
    get_current_user
)

from app.utils.response import (
    success_response
)


router = APIRouter(
    prefix="/query",
    tags=["AI Query"]
)


@router.post("/generate-sql")
def generate_sql(
    payload: QueryRequest,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    sql_query = QueryService.generate_sql(
        db=db,
        connection_id=payload.connection_id,
        question=payload.question
    )

    return success_response(
        message="SQL generated successfully",
        data={
            "sql_query": sql_query
        }
    )