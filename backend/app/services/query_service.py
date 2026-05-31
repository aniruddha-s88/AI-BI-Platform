from app.models.schema_metadata import (
    SchemaMetadata
)

from app.services.prompt_service import (
    PromptService
)

from app.services.ai_service import (
    AIService
)


class QueryService:

    @staticmethod
    def generate_sql(
        db,
        connection_id,
        question
    ):

        question_lower = question.lower()

        # DANGEROUS QUERY DETECTION

        dangerous_keywords = [
            "delete",
            "drop",
            "truncate",
            "update",
            "alter",
            "insert"
        ]

        for keyword in dangerous_keywords:

            if keyword in question_lower:
                return keyword.upper()

        # RULE-BASED FALLBACKS

        if "all users" in question_lower:
            return "SELECT * FROM users;"

        if "all email" in question_lower:
            return "SELECT email FROM users;"

        if "active users" in question_lower:
            return (
                "SELECT * FROM users "
                "WHERE is_active = TRUE;"
            )

        if "inactive users" in question_lower:
            return (
                "SELECT * FROM users "
                "WHERE is_active = FALSE;"
            )

        if "user emails" in question_lower:
            return (
                "SELECT email FROM users;"
            )

        if "count users" in question_lower:
            return (
                "SELECT COUNT(*) AS total_users "
                "FROM users;"
            )

        if "active user count" in question_lower:
            return (
                "SELECT is_active, COUNT(*) AS total "
                "FROM users "
                "GROUP BY is_active;"
            )

        if "users by date" in question_lower:
            return (
                "SELECT created_at, COUNT(*) AS total "
                "FROM users "
                "GROUP BY created_at;"
            )

        # AI GENERATION

        schema_metadata = db.query(
            SchemaMetadata
        ).filter(
            SchemaMetadata.connection_id == connection_id
        ).all()

        prompt = PromptService.build_sql_prompt(
            question,
            schema_metadata
        )

        sql_query = AIService.generate_sql(
            prompt
        )

        return sql_query