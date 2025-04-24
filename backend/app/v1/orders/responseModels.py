from sqlmodel import SQLModel
from uuid import UUID
from datetime import date
from typing import Optional

from app.v1.utils import enumerations as enums
from app.v1.farmer.responseModels import ShowHarvest


class ShowOrderMinimal(SQLModel):
    id: UUID
    total_amount: float
    order_date: date
    order_status: enums.orderStatus
    payment_mode: enums.paymentMode

    model_config = {"from_attributes": True}


class ShowOrder(SQLModel):
    id: UUID
    total_amount: float
    order_date: date
    order_status: enums.orderStatus
    delivery_mode: enums.orderType
    delivery_charges: float
    payment_mode: enums.paymentMode
    order_items: Optional[list["ShowOrderItems"]]

    model_config = {"from_attributes": True}


class ShowOrderItems(SQLModel):
    id: UUID
    order_id: UUID
    qty: int
    rate: float
    harvest: ShowHarvest
    order: "ShowOrderMinimal"

    model_config = {"from_attributes": True}


class OrderDetailsGrouped(SQLModel):
    order: ShowOrderMinimal
    order_items: list[ShowOrderItems]

    model_config = {"from_attributes": True}


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str

    model_config = {"from_attributes": True}
