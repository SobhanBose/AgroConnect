from sqlmodel import SQLModel
from typing import ForwardRef
from uuid import UUID
from datetime import date


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None

    model_config = {"from_attributes": True}


class ShowFarmer(SQLModel):
    description: str | None = None
    user: ShowUser

    model_config = {"from_attributes": True}


showHarvestRef = ForwardRef("ShowHarvest")


class ShowProduceMinimal(SQLModel):
    id: UUID
    name: str
    image_path: str | None = None
    tag: str | None = None
    farmer: ShowFarmer | None = None
    rate: float | None = None
    harvest_date: date

    model_config = {"from_attributes": True}


class ShowProduce(SQLModel):
    id: UUID
    name: str
    description: str | None = None
    image_path: str | None = None
    tag: str | None = None
    # farmer: ShowFarmer
    harvest: showHarvestRef | None = None

    model_config = {"from_attributes": True}


class ShowHarvest(SQLModel):
    id: UUID
    produce_id: UUID
    qty_harvested: int  # Quantity in kg or liters
    harvest_date: date  # YYYY-MM-DD format
    rate: float  # Price in currency per kg or liter
    produce: ShowProduce

    model_config = {"from_attributes": True}


ShowProduce.model_rebuild()


class HarvestGrouped(SQLModel):
    produce: ShowProduce
    harvests: list[ShowHarvest]


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str

    model_config = {"from_attributes": True}
