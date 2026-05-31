class DatasetChartService:
    
    @staticmethod
    def recommend_charts(profile):

        recommendations = []

        numeric_columns = profile.get("numeric_columns", [])
        categorical_columns = profile.get("categorical_columns", [])

        # BAR CHART
        if len(categorical_columns) >= 1 and len(numeric_columns) >= 1:
            recommendations.append({
                "type": "bar",
                "x": categorical_columns[0],
                "y": numeric_columns[0]
            })

        # PIE CHART
        if len(categorical_columns) >= 1:
            recommendations.append({
                "type": "pie",
                "x": categorical_columns[0],
                "y": numeric_columns[0] if numeric_columns else None
            })

        # HISTOGRAM
        if len(numeric_columns) >= 1:
            recommendations.append({
                "type": "histogram",
                "x": numeric_columns[0]
            })

        # LINE CHART
        for column in profile.get("column_names", []):
            if "date" in column.lower() or "time" in column.lower():
                if len(numeric_columns) >= 1:
                    recommendations.append({
                        "type": "line",
                        "x": column,
                        "y": numeric_columns[0]
                    })

        return recommendations