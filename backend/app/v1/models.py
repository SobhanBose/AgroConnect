from typing import Optional
from sqlmodel import Field, SQLModel, Relationship


class User(SQLModel, table=True):
    phone_no: int = Field(primary_key=True, ge=1000000000, le=9999999999, index=True)
    first_name: str | None = None
    last_name: str | None = None
    is_active: bool = Field(default=False)

    farmer: Optional["Farmer"] = Relationship(back_populates="user")


class Farmer(SQLModel, table=True):
    phone_no: int = Field(foreign_key="user.phone_no", primary_key=True)
    description: str = Field(nullable=True, max_length=255)

    user: Optional[User] = Relationship(back_populates="farmer")


class OTP(SQLModel, table=True):
    phone_no: int = Field(
        primary_key=True,
        ge=1000000000,
        le=9999999999,
        index=True,
        foreign_key="user.phone_no",
    )
    otp: int = Field(nullable=False, ge=1000, le=9999)
