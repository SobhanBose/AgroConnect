from typing import Optional
from sqlmodel import Field, SQLModel, Relationship, Enum as SQLEnum, Column
from sqlalchemy import BigInteger, ForeignKey
from uuid import uuid4, UUID
from datetime import date

from app.v1.utils.produce_tag import produceTag


class User(SQLModel, table=True):
    phone_no: int = Field(sa_column=Column(BigInteger(), primary_key=True, index=True), ge=1000000000, le=9999999999)
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool = Field(default=False)

    farmer: Optional["Farmer"] = Relationship(back_populates="user")
    cart: Optional["Cart"] = Relationship(back_populates="consumer")


class Farmer(SQLModel, table=True):
    phone_no: int = Field(sa_column=Column(BigInteger(), ForeignKey("user.phone_no"), primary_key=True, index=True), ge=1000000000, le=9999999999)
    description: str = Field(nullable=True, max_length=255)
    discount_percent: float = Field(default=0.0, ge=0.0, le=100.0)

    user: Optional[User] = Relationship(back_populates="farmer")
    inventory: Optional[list["Produce"]] = Relationship(back_populates="farmer")


class OTP(SQLModel, table=True):
    phone_no: int = Field(sa_column=Column(BigInteger(), ForeignKey("user.phone_no"), primary_key=True, index=True), ge=1000000000, le=9999999999)
    otp: int = Field(nullable=False, ge=1000, le=9999)


class Produce(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    name: str = Field(nullable=False, max_length=255, index=True)
    description: str | None = Field(max_length=255)
    image_path: str = Field(default="https://placehold.co/200", max_length=255)
    tag: str = Column(SQLEnum(produceTag, native_enum=False), nullable=False)
    farmer_phone_no: int = Field(sa_column=Column(BigInteger(), ForeignKey("farmer.phone_no"), index=True), ge=1000000000, le=9999999999)

    farmer: Farmer = Relationship(back_populates="inventory")
    harvests: list["Harvest"] = Relationship(back_populates="produce")


class Harvest(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    produce_id: UUID = Field(default_factory=uuid4, foreign_key="produce.id")
    qty_harvested: int = Field(nullable=False, gt=0)  # Quantity in kg or liters
    harvest_date: date = Field(...)  # YYYY-MM-DD format
    rate: float = Field(nullable=False, gt=0)  # Price in currency per kg or liter
    qty_available: int = Field(default=0, gt=0)  # Quantity available for sale

    produce: Produce = Relationship(back_populates="harvests")


class CartItem(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    cart_id: UUID = Field(default_factory=uuid4, foreign_key="cart.id", index=True)
    harvest_id: UUID = Field(default_factory=uuid4, foreign_key="harvest.id")
    qty: int = Field(nullable=False, gt=0)  # Quantity in kg or liters
    rate: float = Field(nullable=False, gt=0)  # Price in currency per kg or liter

    harvest: Harvest = Relationship()
    cart: "Cart" = Relationship(back_populates="cart_items")


class Cart(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    consumer_phone_no: int = Field(sa_column=Column(BigInteger(), ForeignKey("user.phone_no"), index=True), ge=1000000000, le=9999999999)
    total_amount: float = Field(default=0.0, ge=0.0)

    consumer: User = Relationship(back_populates="cart")
    cart_items: list[CartItem] = Relationship(back_populates="cart")
