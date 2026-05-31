import pandas as pd
from io import BytesIO

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
    Depends
)
from sqlalchemy.orm import Session

from app.api.dependencies.auth_dependency import get_current_user
from app.api.v1.endpoints.csv_query import DATASTORE
from app.db.session import get_db
from app.services.dataset_chart_service import DatasetChartService
from app.services.insight_service import InsightService


router = APIRouter(
    prefix="/upload",
    tags=["Dataset Upload"]
)


@router.post("/csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files allowed"
        )

    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid CSV file"
        )

    if df.empty:
        raise HTTPException(
            status_code=400,
            detail="CSV file is empty"
        )

    DATASTORE[current_user.id] = df.to_dict(orient="records")

    profile = {
        "rows": len(df),
        "columns": len(df.columns),
        "column_names": list(df.columns),
        "missing_values": df.isnull().sum().to_dict(),
        "data_types": df.dtypes.astype(str).to_dict(),
        "numeric_columns": list(
            df.select_dtypes(include=["int64", "float64"]).columns
        ),
        "categorical_columns": list(
            df.select_dtypes(include=["object"]).columns
        )
    }

    chart_recommendations = DatasetChartService.recommend_charts(profile)
    insights = InsightService.generate_insights(profile)
    preview = df.head(5).to_dict(orient="records")

    return {
        "message": "Dataset uploaded successfully",
        "profile": profile,
        "charts": chart_recommendations,
        "insights": insights,
        "preview": preview
    }
