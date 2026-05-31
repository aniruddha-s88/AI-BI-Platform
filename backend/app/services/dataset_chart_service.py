class DatasetChartService:
    
    @staticmethod
    def recommend_charts(
        profile
    ):

        recommendations = []

        numeric_columns = profile.get(
            "numeric_columns",
            []
        )

        categorical_columns = profile.get(
            "categorical_columns",
            []
        )

        # BAR CHART

        if (
            len(categorical_columns) >= 1
            and len(numeric_columns) >= 1
        ):

            recommendations.append({
                "chart_type": "bar",
                "x_axis": categorical_columns[0],
                "y_axis": numeric_columns[0]
            })

        # PIE CHART

        if len(categorical_columns) >= 1:

            recommendations.append({
                "chart_type": "pie",
                "label": categorical_columns[0]
            })

        # HISTOGRAM

        if len(numeric_columns) >= 1:

            recommendations.append({
                "chart_type": "histogram",
                "column": numeric_columns[0]
            })

        # LINE CHART

        for column in profile.get(
            "column_names",
            []
        ):

            if (
                "date" in column.lower()
                or "time" in column.lower()
            ):

                if len(numeric_columns) >= 1:

                    recommendations.append({
                        "chart_type": "line",
                        "x_axis": column,
                        "y_axis": numeric_columns[0]
                    })

        return recommendations