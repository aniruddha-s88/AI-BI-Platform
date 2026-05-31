from fastapi import HTTPException


class SQLValidatorService:

    FORBIDDEN_KEYWORDS = [
        "drop",
        "delete",
        "truncate",
        "update",
        "alter",
        "insert"
    ]

    @staticmethod
    def validate_query(
        sql_query: str
    ):

        query_lower = sql_query.lower()

        for keyword in (
            SQLValidatorService.FORBIDDEN_KEYWORDS
        ):

            if keyword in query_lower:

                raise HTTPException(
                    status_code=400,
                    detail=(
                        f"Forbidden SQL operation: "
                        f"{keyword}"
                    )
                )

        if not query_lower.strip().startswith(
            "select"
        ):

            raise HTTPException(
                status_code=400,
                detail="Only SELECT queries allowed"
            )

        return True