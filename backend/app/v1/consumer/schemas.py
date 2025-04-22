from sqlmodel import SQLModel
from uuid import UUID


class ConsumerUpdate(SQLModel):
    first_name: str | None = None
    last_name: str | None = None


class CartItemCreate(SQLModel):
    harvest_id: UUID
    qty: int


class CartItemUpdate(SQLModel):
    qty: int | None = None
