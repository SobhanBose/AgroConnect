from sqlmodel import SQLModel
from uuid import UUID
from datetime import date
from typing import ForwardRef


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None
    latitude: float | None = None
    longitude: float | None = None

    model_config = {"from_attributes": True}


class ShowFarmer(SQLModel):
    description: str | None = None
    discount_percent: float | None = None
    earnings: float | None = None
    inventory: int = 0

    model_config = {"from_attributes": True}


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str


showHarvestRef = ForwardRef("ShowHarvest")


class ShowProduce(SQLModel):
    id: UUID
    name: str
    description: str | None = None
    image_path: str | None = None
    tag: str | None = None
    # farmer: ShowFarmer
    harvest: showHarvestRef | None = None
    farmer: ShowFarmer

    model_config = {"from_attributes": True}


class ShowProduceMinimal(SQLModel):
    id: UUID
    name: str
    description: str | None = None
    image_path: str | None = None
    tag: str | None = None

    model_config = {"from_attributes": True}


class ShowHarvest(SQLModel):
    id: UUID
    produce_id: UUID
    qty_harvested: int  # Quantity in kg or liters
    harvest_date: date  # YYYY-MM-DD format
    rate: float  # Price in currency per kg or liter
    qty_available: int  # Quantity available for sale
    produce: ShowProduce

    model_config = {"from_attributes": True}


ShowProduce.model_rebuild()


class HarvestGrouped(SQLModel):
    produce: ShowProduce
    harvests: list[ShowHarvest]
