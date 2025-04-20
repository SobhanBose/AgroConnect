from sqlmodel import SQLModel


class ConsumerUpdate(SQLModel):
    first_name: str | None = None
    last_name: str | None = None
