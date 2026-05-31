from app.models.query_history import (
    QueryHistory
)


class QueryHistoryRepository:

    @staticmethod
    def create_history(
        db,
        history_data
    ):

        history = QueryHistory(
            **history_data
        )

        db.add(history)

        db.commit()

        db.refresh(history)

        return history