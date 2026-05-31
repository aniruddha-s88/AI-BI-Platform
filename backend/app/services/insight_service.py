class InsightService:
    
    # -------------------------------
    # CSV PROFILE INSIGHTS
    # -------------------------------
    @staticmethod
    def generate_insights(profile):

        insights = []

        # BASIC INFO
        insights.append(
            f"Dataset contains {profile.get('rows', 0)} rows"
        )

        insights.append(
            f"Dataset has {profile.get('columns', 0)} columns"
        )

        # MISSING VALUES
        missing_values = profile.get("missing_values", {})

        for column, count in missing_values.items():
            if count > 0:
                insights.append(
                    f"Column '{column}' contains {count} missing values"
                )

        # NUMERIC COLUMNS
        numeric_columns = profile.get("numeric_columns", [])

        if numeric_columns:
            insights.append(
                f"Numeric analysis possible for: {', '.join(numeric_columns)}"
            )

        # CATEGORICAL COLUMNS
        categorical_columns = profile.get("categorical_columns", [])

        if categorical_columns:
            insights.append(
                f"Categorical analysis possible for: {', '.join(categorical_columns)}"
            )

        return insights


    # --------------------------------
    # DB QUERY INSIGHTS
    # --------------------------------
    @staticmethod
    def generate_query_insights(results):

        if not results:
            return ["No data available"]

        insights = []

        total = len(results)
        insights.append(f"Total records: {total}")

        first_row = results[0]

        for key, value in first_row.items():

            # -----------------------
            # BOOLEAN INSIGHTS
            # -----------------------
            if isinstance(value, bool):

                true_count = sum(
                    1 for r in results
                    if bool(r.get(key)) is True
                )

                percent = (true_count / total) * 100

                insights.append(
                    f"{percent:.1f}% of records have {key} = True"
                )

            # -----------------------
            # NUMERIC INSIGHTS
            # -----------------------
            values = []

            for r in results:
                v = r.get(key)

                if isinstance(v, (int, float)):
                    values.append(v)

            if values:

                avg = sum(values) / len(values)
                min_val = min(values)
                max_val = max(values)

                insights.append(
                    f"{key}: avg={avg:.2f}, min={min_val}, max={max_val}"
                )

        # LIMIT INSIGHTS (IMPORTANT)
        return insights[:5]