from sqlmodel import SQLModel, Field
from pydantic import BaseModel, field_validator
from app.v1 import models


class RegisterConsumerUpdate(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)
    first_name: str = Field(nullable=False, max_length=50)
    last_name: str | None = None
    latitude: float = Field(nullable=False, ge=-90.0, le=90.0)
    longitude: float = Field(nullable=False, ge=-180.0, le=180.0)

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not -90 <= v <= 90:
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not -180 <= v <= 180:
            raise ValueError("Longitude must be between -180 and 180")
        return v

    def to_place_model(self) -> models.User:
        return f"POINT({self.longitude} {self.latitude})"


class RegisterFarmerUpdate(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)
    first_name: str = Field(nullable=False, max_length=50)
    last_name: str | None = None
    description: str = Field(nullable=True, max_length=255)

    latitude: float = Field(nullable=False, ge=-90.0, le=90.0)
    longitude: float = Field(nullable=False, ge=-180.0, le=180.0)

    @field_validator("latitude")
    @classmethod
    def validate_latitude(cls, v: float) -> float:
        if not -90 <= v <= 90:
            raise ValueError("Latitude must be between -90 and 90")
        return v

    @field_validator("longitude")
    @classmethod
    def validate_longitude(cls, v: float) -> float:
        if not -180 <= v <= 180:
            raise ValueError("Longitude must be between -180 and 180")
        return v

    def to_place_model(self) -> models.User:
        return f"POINT({self.longitude} {self.latitude})"


class OTPRequest(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)


class OTPVerificationRequest(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)
    otp: int = Field(nullable=False, ge=1000, le=9999)
