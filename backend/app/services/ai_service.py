from transformers import pipeline
import requests
import json

from app.core.config import settings


class AIService:
    # ---------------------------
    # SQL GENERATION
    # ---------------------------
    generator = pipeline(
        "text-generation",
        model="Salesforce/codegen-350M-mono"
    )

    @staticmethod
    def _get_prompt_intent(prompt: str | None = None):
        text = (prompt or "").lower()
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

    @staticmethod
    def _build_chart_recommendations(columns, sample_data, prompt: str | None = None):
        numeric_columns = []
        categorical_columns = []
        date_columns = []
        prompt_text = (prompt or "").lower()
        intent = AIService._get_prompt_intent(prompt)

        def prompt_wants(*keywords):
            return any(keyword in prompt_text for keyword in keywords)

        def score_column(column_name, values, keywords):
            score = 0
            column_text = column_name.lower()
            for keyword in keywords:
                if keyword in column_text:
                    score += 3
                for value in values:
                    value_text = str(value).lower()
                    if keyword in value_text:
                        score += 1
            return score

        for key in columns:
            values = [row.get(key) for row in sample_data if row.get(key) is not None]
            numeric_count = 0
            date_like_count = 0
            for value in values:
                try:
                    float(str(value).replace(",", ""))
                    numeric_count += 1
                except Exception:
                    pass
                value_text = str(value).lower()
                if (
                    "-" in value_text
                    or "/" in value_text
                    or "date" in key.lower()
                    or "time" in key.lower()
                ):
                    date_like_count += 1

            if values and numeric_count >= max(1, len(values) // 2):
                numeric_columns.append(key)
            elif values and date_like_count >= max(1, len(values) // 2):
                date_columns.append(key)
            else:
                categorical_columns.append(key)

        prompt_keywords = []
        if "furniture" in prompt_text:
            prompt_keywords.extend([
                "furniture", "chair", "table", "sofa", "desk", "bed",
                "cabinet", "shelf", "storage", "office", "home", "wood",
                "dining", "living", "bedroom"
            ])
        if "sales" in prompt_text or "revenue" in prompt_text:
            prompt_keywords.extend(["sales", "revenue", "amount", "total", "profit", "order"])
        if "customer" in prompt_text:
            prompt_keywords.extend(["customer", "client", "buyer", "segment", "region"])
        if "product" in prompt_text or "item" in prompt_text:
            prompt_keywords.extend(["product", "item", "sku", "category", "subcategory"])

        prompt_keywords = list(dict.fromkeys(prompt_keywords))

        if "compare" in prompt_text or "vs" in prompt_text or "versus" in prompt_text:
            prompt_keywords.extend(["compare", "difference", "versus", "vs"])
        if "trend" in prompt_text or "over time" in prompt_text:
            prompt_keywords.extend(["date", "time", "month", "week", "day", "year"])
        if "distribution" in prompt_text or "breakdown" in prompt_text or "share" in prompt_text:
            prompt_keywords.extend(["category", "segment", "group"])

        if prompt_keywords and categorical_columns:
            categorical_columns = sorted(
                categorical_columns,
                key=lambda col: score_column(
                    col,
                    [row.get(col) for row in sample_data if row.get(col) is not None],
                    prompt_keywords
                ),
                reverse=True
            )

        if prompt_keywords and numeric_columns:
            numeric_columns = sorted(
                numeric_columns,
                key=lambda col: score_column(
                    col,
                    [row.get(col) for row in sample_data if row.get(col) is not None],
                    prompt_keywords
                ),
                reverse=True
            )

        if prompt_keywords and date_columns:
            date_columns = sorted(
                date_columns,
                key=lambda col: score_column(
                    col,
                    [row.get(col) for row in sample_data if row.get(col) is not None],
                    prompt_keywords
                ),
                reverse=True
            )

        recommendations = []

        def add_chart(chart_type, **kwargs):
            chart = {"type": chart_type, "chart_type": chart_type, **kwargs}
            if chart not in recommendations:
                recommendations.append(chart)

        # Prompt-aware preferences help the dashboard feel different per question.
        preferred_types = []
        if intent == "trend" or prompt_wants("trend", "over time", "time series", "timeline", "monthly", "daily", "weekly"):
            preferred_types.extend(["line", "bar"])
        if intent in {"comparison", "highest", "lowest"} or prompt_wants("compare", "comparison", "vs", "versus", "top", "rank", "best", "worst", "highest", "lowest"):
            preferred_types.extend(["bar", "pie"])
        if prompt_wants("distribution", "spread", "variation", "histogram"):
            preferred_types.extend(["bar", "pie"])
        if prompt_wants("relationship", "correlat", "correlation", "compare two", "scatter"):
            preferred_types.extend(["scatter", "line"])
        if prompt_wants("share", "percentage", "proportion", "breakdown", "mix"):
            preferred_types.extend(["pie", "bar"])

        preferred_types = list(dict.fromkeys(preferred_types))

        if categorical_columns and numeric_columns:
            add_chart("bar", x=categorical_columns[0], y=numeric_columns[0])
            add_chart("pie", x=categorical_columns[0], y=numeric_columns[0])

        if len(categorical_columns) >= 2 and numeric_columns:
            add_chart("bar", x=categorical_columns[1], y=numeric_columns[0])

        if len(numeric_columns) >= 2:
            add_chart("scatter", x=numeric_columns[0], y=numeric_columns[1])

        if date_columns and numeric_columns:
            add_chart("line", x=date_columns[0], y=numeric_columns[0])

        mandatory_types = {chart["type"] for chart in recommendations}
        if "pie" not in mandatory_types and categorical_columns and numeric_columns:
            add_chart("pie", x=categorical_columns[0], y=numeric_columns[0])
        if "scatter" not in mandatory_types and len(numeric_columns) >= 2:
            add_chart("scatter", x=numeric_columns[0], y=numeric_columns[1])

        filtered = []
        allowed_types = {"bar", "pie", "scatter", "line"}
        for chart in recommendations:
            if chart.get("type") in allowed_types and chart not in filtered:
                filtered.append(chart)

        if preferred_types:
            preferred_order = []
            seen_types = set()
            for chart_type in preferred_types:
                for chart in filtered:
                    if chart.get("type") == chart_type and chart_type not in seen_types:
                        preferred_order.append(chart)
                        seen_types.add(chart_type)
                        break
            for chart in filtered:
                chart_type = chart.get("type")
                if chart_type not in seen_types:
                    preferred_order.append(chart)
                    seen_types.add(chart_type)
            filtered = preferred_order

        if date_columns and numeric_columns and not any(c.get("type") == "line" for c in filtered):
            filtered.append({
                "type": "line",
                "chart_type": "line",
                "x": date_columns[0],
                "y": numeric_columns[0]
            })

        if intent == "lowest":
            filtered = list(reversed(filtered))

        limited = filtered[:4]
        if limited:
            for chart in limited:
                chart["title"] = chart.get("title") or (
                    f"{(prompt or '').strip()[:40]}".strip() or "Analytics"
                )
        return limited

    @staticmethod
    def _build_business_recommendations(prompt, columns, sample_data):
        text = (prompt or "").lower()
        numeric_columns = []
        categorical_columns = []

        for key in columns:
            values = [row.get(key) for row in sample_data if row.get(key) is not None]
            numeric_count = 0
            for value in values:
                try:
                    float(str(value).replace(",", ""))
                    numeric_count += 1
                except Exception:
                    pass
            if values and numeric_count >= max(1, len(values) // 2):
                numeric_columns.append(key)
            else:
                categorical_columns.append(key)

        primary_metric = numeric_columns[0] if numeric_columns else "key metric"
        primary_dimension = categorical_columns[0] if categorical_columns else "segment"

        recommendations = []
        if "improv" in text or "improve" in text or "grow" in text or "business" in text:
            recommendations.extend([
                f"Double down on the highest-performing {primary_dimension} segments and reduce investment in low-return areas.",
                f"Set a weekly operating target for {primary_metric} and track the top drivers behind movement in that metric.",
                "Launch a retention or re-engagement campaign for customers or segments showing early decline.",
                "Remove friction from the highest-dropoff step in the funnel to improve conversion and revenue capture."
            ])
        else:
            recommendations.extend([
                f"Scale the strongest {primary_dimension} segments to improve {primary_metric} and overall return.",
                f"Create a 30-day action plan for the weakest areas tied to {primary_metric} and assign an owner.",
                "Track the top two operational bottlenecks weekly and remove one blocker at a time.",
                "Review performance against target trend every week and adjust the plan based on the gap."
            ])

        return recommendations[:4]

    @staticmethod
    def generate_sql(prompt: str):
        result = AIService.generator(
            prompt,
            max_new_tokens=60,
            temperature=0.1,
            do_sample=False
        )

        generated_text = result[0]["generated_text"]

        if "SQL Query:" in generated_text:
            generated_text = generated_text.split("SQL Query:")[-1]

        generated_text = generated_text.strip()
        lines = generated_text.splitlines()

        sql_lines = []
        for line in lines:
            if line.strip() == "":
                continue

            sql_lines.append(line)

            if ";" in line:
                break

        return " ".join(sql_lines)

    # ---------------------------
    # GROQ DASHBOARD GENERATOR
    # ---------------------------
    @staticmethod
    def generate_insights(results, prompt: str | None = None):
        if not results:
            return {
                "kpis": [],
                "charts": [],
                "insights": ["No data available"],
                "recommendations": []
            }

        # LIMIT DATA (IMPORTANT FOR TOKENS)
        sample_data = [
            {k: str(v)[:30] for k, v in row.items()}
            for row in results[:5]
        ]

        columns = list(sample_data[0].keys()) if sample_data else []

        # PROMPT
        chart_recommendations = AIService._build_chart_recommendations(
            columns=columns,
            sample_data=sample_data,
            prompt=prompt
        )

        user_context = f"""
You are a Business Intelligence AI.

User question:
{prompt}

You must build a dashboard.
You must also explain how the business can improve based on the data.

Return ONLY JSON (no explanation):

{{
  "kpis": [
    {{ "title": "Total", "value": "..." }}
  ],
  "charts": [
    {{
      "type": "bar",
      "x": "column_name",
      "y": "column_name"
    }}
  ],
  "insights": [
    "short insight 1",
    "short insight 2"
  ],
  "recommendations": [
    "specific business action 1",
    "specific business action 2"
  ]
}}

        Rules:
- Choose correct columns from dataset
- Prefer a mix of chart types when possible: bar, pie, line, scatter
- If there is a date/time column, include a line chart
- If there are 2 numeric columns, include a scatter chart
- If there is one categorical and one numeric column, include a bar or pie chart
- Include only these chart types: bar, pie, scatter, line
- Return at most 4 charts
- Always include at least 1 KPI
- Keep it simple and meaningful
- Recommendations must be practical business actions, not data descriptions
- Focus recommendations on revenue growth, cost reduction, retention, conversion, or operational improvement
- Include 2 to 5 recommendations
- If the user asks how to improve the business, prioritize recommendations over chart variety
- Make the recommendations specific, actionable, and business-facing
- Mention what should be done next, not just what the data shows
- Write recommendations like a senior business analyst or product manager
- Use direct, executive-style language
- Avoid generic phrases like "analyze further" or "explore more"
- Each recommendation should imply a concrete decision or action

Suggested chart ideas:
{chart_recommendations}

Columns:
{columns}

Sample Data:
{sample_data}
"""

        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {"role": "user", "content": user_context}
                    ]
                },
                timeout=10
            )

            data = response.json()

            if "choices" not in data:
                return {
                    "kpis": [],
                    "charts": [],
                    "insights": ["AI failed", str(data)],
                    "recommendations": []
                }

            content = data["choices"][0]["message"]["content"]
            content = content.replace("```json", "").replace("```", "").strip()

            try:
                parsed = json.loads(content)
            except Exception:
                parsed = {}

            charts = parsed.get("charts", [])
            if not isinstance(charts, list):
                charts = []

            normalized_charts = []
            for chart in charts:
                if not isinstance(chart, dict):
                    continue
                chart_type = chart.get("type") or chart.get("chart_type")
                if not chart_type:
                    continue
                normalized = {
                    "type": chart_type,
                    "chart_type": chart_type,
                }
                for key in ("x", "y", "label", "column", "values", "name", "title"):
                    if chart.get(key) is not None:
                        normalized[key] = chart.get(key)
                normalized_charts.append(normalized)

            existing_types = {chart.get("type") for chart in normalized_charts}
            for chart in chart_recommendations:
                if chart.get("type") not in existing_types:
                    normalized_charts.append(chart)
                    existing_types.add(chart.get("type"))

            # Reorder charts so prompt intent can influence what is shown first.
            chart_type_preferences = [chart.get("type") for chart in chart_recommendations if chart.get("type")]
            if chart_type_preferences:
                reordered = []
                used_types = set()
                for chart_type in chart_type_preferences:
                    for chart in normalized_charts:
                        if chart.get("type") == chart_type and chart_type not in used_types:
                            reordered.append(chart)
                            used_types.add(chart_type)
                            break
                for chart in normalized_charts:
                    chart_type = chart.get("type")
                    if chart_type not in used_types:
                        reordered.append(chart)
                        used_types.add(chart_type)
                normalized_charts = reordered

            if not normalized_charts:
                normalized_charts = [{
                    "type": "bar",
                    "chart_type": "bar",
                    "x": columns[0] if columns else "x",
                    "y": columns[1] if len(columns) > 1 else (columns[0] if columns else "y")
                }]

            insights = parsed.get("insights", []) or ["Dashboard generated"]
            recommendations = parsed.get("recommendations", []) or AIService._build_business_recommendations(
                prompt=prompt,
                columns=columns,
                sample_data=sample_data
            )

            # Keep recommendations distinct from insights.
            if recommendations == insights:
                recommendations = AIService._build_business_recommendations(
                    prompt=prompt,
                    columns=columns,
                    sample_data=sample_data
                )

            return {
                "kpis": parsed.get("kpis", []),
                "charts": normalized_charts,
                "insights": insights,
                "recommendations": recommendations
            }

        except Exception:
            fallback_charts = chart_recommendations or [{
                "type": "bar",
                "chart_type": "bar",
                "x": columns[0] if columns else "x",
                "y": columns[1] if len(columns) > 1 else (columns[0] if columns else "y")
            }]
            return {
                "kpis": [],
                "charts": fallback_charts,
                "insights": ["Fallback dashboard generated"],
                "recommendations": AIService._build_business_recommendations(
                    prompt=prompt,
                    columns=columns,
                    sample_data=sample_data
                )
            }

    # ---------------------------
    # SIMPLE TEXT GENERATION
    # ---------------------------
    @staticmethod
    def generate_text(prompt: str):
        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {settings.GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [
                        {"role": "user", "content": prompt}
                    ]
                }
            )

            data = response.json()

            if "choices" not in data:
                return "AI failed"

            return data["choices"][0]["message"]["content"]

        except Exception:
            return "AI unavailable"
