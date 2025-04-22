from sqlmodel import SQLModel
from uuid import UUID


class ConsumerUpdate(SQLModel):
    first_name: str | None = None
    last_name: str | None = None
