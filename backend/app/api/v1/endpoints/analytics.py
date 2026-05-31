from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies.auth_dependency import get_current_user
from app.db.session import get_db
from app.models.database_connection import DatabaseConnection
from app.repositories.query_history_repository import QueryHistoryRepository
from app.schemas.query_schema import QueryRequest
from app.services.ai_service import AIService
from app.services.insight_service import InsightService
from app.services.query_service import QueryService
from app.services.sql_execution_service import SQLExecutionService
from app.services.sql_validator_service import SQLValidatorService
from app.utils.response import success_response


router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.post("/query")
def analytics_query(
    payload: QueryRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    connection = db.query(DatabaseConnection).filter(
        DatabaseConnection.id == payload.connection_id,
        DatabaseConnection.user_id == current_user.id,
    ).first()

    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")

    sql_query = QueryService.generate_sql(
        db=db,
        connection_id=payload.connection_id,
        question=payload.question,
    )

    SQLValidatorService.validate_query(sql_query)

    results = SQLExecutionService.execute_query(connection, sql_query)

    insights = InsightService.generate_query_insights(results)
    dashboard = AIService.generate_insights(results, payload.question)

    QueryHistoryRepository.create_history(
        db=db,
        history_data={
            "user_id": current_user.id,
            "connection_id": payload.connection_id,
            "question": payload.question,
            "generated_sql": sql_query,
            "chart_type": dashboard.get("charts", [{}])[0].get("type") if dashboard.get("charts") else None,
        },
    )

    return success_response(
        message="Analytics query executed successfully",
        data={
            "generated_sql": sql_query,
            "charts": dashboard.get("charts", []),
            "results": results,
            "insights": dashboard.get("insights", insights),
            "kpis": dashboard.get("kpis", []),
        },
    )
