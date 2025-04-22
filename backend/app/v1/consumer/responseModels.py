from sqlmodel import SQLModel
from uuid import UUID


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None

    model_config = {"from_attributes": True}


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str

    model_config = {"from_attributes": True}


class ShowCartItem(SQLModel):
    id: UUID
    cart_id: UUID
    harvest_id: UUID
    qty: int
    rate: float

    model_config = {"from_attributes": True}


class ShowCart(SQLModel):
    id: UUID
    consumer_phone_no: int
    total_amount: float
    cart_items: list[ShowCartItem] = []

    model_config = {"from_attributes": True}
