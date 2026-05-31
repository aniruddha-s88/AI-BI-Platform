class DashboardService:

    @staticmethod
    def _to_number(value):
        if isinstance(value, (int, float)):
            return value
        try:
            text = str(value).strip().replace(",", "")
            if text == "":
                return None
            return float(text)
        except Exception:
            return None

    @staticmethod
    def _is_date_like(value, column_name=""):
        if value is None:
            return False
        text = str(value).strip().lower()
        return (
            "date" in column_name.lower()
            or "time" in column_name.lower()
            or "-" in text
            or "/" in text
            or ":" in text
        )
    
    @staticmethod
    def build_dashboard(data):
        if not data:
            return {
                "kpis": [],
                "charts": [],
                "insights": ["No data available"]
            }

        columns = list(data[0].keys())

        numeric_columns = []
        categorical_columns = []
        date_columns = []

        for col in columns:
            sample = [row.get(col) for row in data[:10]]

            numeric_sample = [DashboardService._to_number(v) for v in sample if v is not None]
            numeric_count = len([v for v in numeric_sample if v is not None])
            date_like_count = len([v for v in sample if DashboardService._is_date_like(v, col)])

            if numeric_count and numeric_count >= max(1, len(sample) // 2):
                numeric_columns.append(col)
            elif date_like_count >= max(1, len(sample) // 2):
                date_columns.append(col)
            else:
                categorical_columns.append(col)

        kpis = [{"title": "Total Records", "value": len(data)}]

        if numeric_columns:
            numeric_values = [
                DashboardService._to_number(row.get(numeric_columns[0]))
                for row in data
                if DashboardService._to_number(row.get(numeric_columns[0])) is not None
            ]
            avg = sum(numeric_values) / len(numeric_values) if numeric_values else 0
            kpis.append({
                "title": f"Avg {numeric_columns[0]}",
                "value": round(avg, 2)
            })

        if date_columns:
            kpis.append({
                "title": "Time Columns",
                "value": len(date_columns)
            })

        charts = []

        if categorical_columns and numeric_columns:
            charts.append({
                "type": "bar",
                "x": categorical_columns[0],
                "y": numeric_columns[0]
            })
            charts.append({
                "type": "pie",
                "x": categorical_columns[0],
                "y": numeric_columns[0]
            })

        if date_columns and numeric_columns:
            charts.append({
                "type": "line",
                "x": date_columns[0],
                "y": numeric_columns[0]
            })

        if len(numeric_columns) >= 2:
            charts.append({
                "type": "scatter",
                "x": numeric_columns[0],
                "y": numeric_columns[1]
            })

        if not charts and len(columns) >= 2:
            charts.append({
                "type": "bar",
                "x": categorical_columns[0] if categorical_columns else columns[0],
                "y": numeric_columns[0] if numeric_columns else columns[1]
            })

        unique_types = []
        normalized_charts = []
        for chart in charts:
            chart_type = chart.get("type")
            if chart_type and chart_type not in unique_types:
                unique_types.append(chart_type)
                normalized_charts.append({
                    "type": chart_type,
                    "chart_type": chart_type,
                    "x": chart.get("x"),
                    "y": chart.get("y")
                })

        return {
            "kpis": kpis,
            "charts": normalized_charts[:4],
            "insights": [
                f"Detected {len(numeric_columns)} numeric column(s) and {len(categorical_columns)} categorical column(s).",
                f"Identified {len(date_columns)} date-like column(s) for trend analysis.",
                "Dashboard suggestions were generated from the uploaded dataset."
            ]
        }
