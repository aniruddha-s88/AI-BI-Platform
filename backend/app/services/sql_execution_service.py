from sqlalchemy import create_engine, text


class SQLExecutionService:

    @staticmethod
    def execute_query(
        connection,
        sql_query
    ):

        database_url = (
            f"postgresql://{connection.username}:"
            f"{connection.password}@"
            f"{connection.host}:"
            f"{connection.port}/"
            f"{connection.database_name}"
        )

        engine = create_engine(database_url)

        with engine.connect() as conn:

            result = conn.execute(
                text(sql_query)
            )

            rows = result.fetchall()

            columns = result.keys()

            data = []

            for row in rows:

                data.append(
                    dict(zip(columns, row))
                )

            return data