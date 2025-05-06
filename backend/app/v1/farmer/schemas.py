from sqlmodel import Field, SQLModel, Enum as SQLEnum, Column
from uuid import UUID

from app.v1.utils.enumerations import produceTag


class ProduceCreate(SQLModel):
    name: str = Field(..., max_length=255)
    description: str | None = Field(default=None, max_length=255)
    image_path: str | None = Field(default="https://placehold.co/200", max_length=255)
    tag: produceTag | None = None  # Assuming produceTag is a string enum


class HarvestCreate(SQLModel):
    produce_id: UUID  # UUID as string
    qty_harvested: int = Field(..., gt=0)  # Quantity in kg or liters
    harvest_date: str | None = None  # YYYY-MM-DD format
    rate: float = Field(..., gt=0)  # Price in currency per kg or liter
