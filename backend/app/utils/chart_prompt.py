def get_prompt_intent(question):
    text = (question or "").lower()
    if any(word in text for word in ("compare", "vs", "versus", "difference")):
        return "comparison"
    if any(word in text for word in ("trend", "over time", "monthly", "weekly", "daily", "year")):
        return "trend"
    if any(word in text for word in ("distribution", "breakdown", "share", "percentage", "mix")):
        return "distribution"
    if any(word in text for word in ("relationship", "correlation", "scatter")):
        return "relationship"
    if any(word in text for word in ("highest", "top", "most", "largest", "best")):
        return "highest"
    if any(word in text for word in ("lowest", "least", "smallest", "bottom")):
        return "lowest"
    return "general"


def get_chart_from_prompt(question, columns):
    question = (question or "").lower()
    intent = get_prompt_intent(question)
    metric_keywords = ["sales", "revenue", "profit", "amount", "price", "value", "count", "total", "sum"]
    dimension_keywords = ["region", "category", "product", "segment", "city", "country", "class", "type"]
    date_keywords = ["date", "time", "month", "day", "year", "week"]
    furniture_keywords = ["furniture", "chair", "table", "sofa", "desk", "bed", "cabinet", "shelf"]

    y = next((col for col in columns if any(word in col.lower() for word in metric_keywords)), None)
    x = next((col for col in columns if any(word in col.lower() for word in dimension_keywords)), None)
    date_x = next((col for col in columns if any(word in col.lower() for word in date_keywords)), None)
    furniture_x = next((col for col in columns if any(word in col.lower() for word in furniture_keywords)), None)

    if "furniture" in question and furniture_x:
        x = furniture_x

    if "region" in question:
        region_col = next((col for col in columns if "region" in col.lower() or "state" in col.lower() or "country" in col.lower()), None)
        if region_col:
            x = region_col

    if "sales" in question or "revenue" in question or "profit" in question:
        metric_col = next((col for col in columns if any(word in col.lower() for word in metric_keywords)), None)
        if metric_col:
            y = metric_col

    if not y and columns:
        y = columns[-1]
    if not x and columns:
        x = columns[0]

    chart_type = "bar"
    if intent == "trend" or any(word in question for word in ("trend", "over time", "growth")):
        chart_type = "line"
        if date_x:
            x = date_x
    elif intent == "distribution" or any(word in question for word in ("distribution", "share", "breakdown")):
        chart_type = "pie"
    elif intent == "relationship":
        chart_type = "scatter"
    elif intent in ("comparison", "highest", "lowest"):
        chart_type = "bar"

    unique = []
    seen = set()
    charts = [{
        "type": chart_type,
        "x": x,
        "y": y,
        "sort": "asc" if intent == "lowest" else "desc" if intent in ("highest", "comparison") else None
    }]

    if intent == "highest":
        charts.append({"type": "bar", "x": x, "y": y, "sort": "desc"})
    elif intent == "lowest":
        charts.append({"type": "bar", "x": x, "y": y, "sort": "asc"})
    elif intent == "trend" and date_x and x != date_x:
        charts.append({"type": "line", "x": date_x, "y": y})
    elif intent == "distribution":
        charts.append({"type": "bar", "x": x, "y": y})
    elif intent == "relationship":
        charts.append({"type": "scatter", "x": x, "y": y})

    for chart in charts:
        key = (chart.get("type"), chart.get("x"), chart.get("y"))
        if key not in seen:
            seen.add(key)
            unique.append(chart)

    return unique[:4]
