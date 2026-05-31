from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies.auth_dependency import get_current_user
from app.services.ai_service import AIService

from app.utils.chart_prompt import get_chart_from_prompt
router = APIRouter(
    prefix="/csv",
    tags=["CSV Query"]
)

# TEMP MEMORY (we improve later)
DATASTORE = {}


@router.post("/store")
def store_dataset(data: list, current_user=Depends(get_current_user)):
    DATASTORE[current_user.id] = data
    return {"message": "Dataset stored"}



@router.post("/ask")
def ask_csv(question: str, current_user=Depends(get_current_user)):

    if current_user.id not in DATASTORE:
        raise HTTPException(
            status_code=400,
            detail="No dataset uploaded"
        )

    data = DATASTORE[current_user.id]

    columns = list(data[0].keys())
    ai_output = AIService.generate_insights(results=data, prompt=question)
    charts = ai_output.get("charts") if isinstance(ai_output, dict) else []
    prompt_charts = get_chart_from_prompt(question, columns)

    normalized_charts = []
    existing = set()
    for chart in (charts or []):
        if not isinstance(chart, dict):
            continue
        chart_type = chart.get("type") or chart.get("chart_type")
        if not chart_type:
            continue
        normalized = {
            "type": chart_type,
            "chart_type": chart_type,
            "x": chart.get("x"),
            "y": chart.get("y")
        }
        if chart.get("sort"):
            normalized["sort"] = chart.get("sort")
        key = (normalized["type"], normalized.get("x"), normalized.get("y"))
        if key not in existing:
            existing.add(key)
            normalized_charts.append(normalized)

    for chart in prompt_charts:
        chart_type = chart.get("type")
        key = (chart_type, chart.get("x"), chart.get("y"))
        if chart_type and key not in existing:
            if chart.get("sort"):
                chart["sort"] = chart.get("sort")
            existing.add(key)
            normalized_charts.append(chart)

    results = data[:20]

    return {
        "charts": normalized_charts[:4],
        "insights": ai_output.get("insights") if isinstance(ai_output, dict) else ai_output,
        "recommendations": ai_output.get("recommendations", []) if isinstance(ai_output, dict) else [],
        "kpis": ai_output.get("kpis", []) if isinstance(ai_output, dict) else [],
        "results": results
    }
