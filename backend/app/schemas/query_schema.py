from pydantic import BaseModel


class QueryRequest(BaseModel):

    connection_id: int

    question: str