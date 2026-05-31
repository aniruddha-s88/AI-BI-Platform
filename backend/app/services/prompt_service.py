class PromptService:
    
    @staticmethod
    def build_sql_prompt(
        question,
        schema_metadata
    ):

        schema_text = ""

        tables = {}

        for item in schema_metadata:

            if item.table_name not in tables:
                tables[item.table_name] = []

            tables[item.table_name].append(
                f"{item.column_name} ({item.data_type})"
            )

        for table_name, columns in tables.items():

            schema_text += (
                f"\nTable: {table_name}\n"
            )

            schema_text += (
                "Columns: "
                + ", ".join(columns)
                + "\n"
            )

        prompt = f"""
You are an expert PostgreSQL SQL generator.

Generate ONLY valid SQL query.

Rules:
1. Return ONLY SQL.
2. No explanations.
3. No markdown.
4. Use PostgreSQL syntax.
5. Use only tables and columns provided.

Database Schema:
{schema_text}

User Question:
{question}

SQL Query:
"""

        return prompt