from sqlmodel import SQLModel
from uuid import UUID


class CartItemCreate(SQLModel):
    harvest_id: UUID
    qty: int


class CartItemUpdate(SQLModel):
    qty: int | None = None
