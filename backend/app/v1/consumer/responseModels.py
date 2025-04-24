from sqlmodel import SQLModel
from uuid import UUID

from app.v1.orders.responseModels import ShowOrder, ShowOrderItems, ShowOrderMinimal


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    orders: int = 0

    model_config = {"from_attributes": True}


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str

    model_config = {"from_attributes": True}
