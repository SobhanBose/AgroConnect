from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class RegisterOTPRequest(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)
    type: str = Field(nullable=False, max_length=50)


class RegisterConsumerUpdate(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)
    first_name: str = Field(nullable=False, max_length=50)
    last_name: str | None = None


class RegisterFarmerUpdate(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)
    first_name: str = Field(nullable=False, max_length=50)
    last_name: str | None = None
    description: str = Field(nullable=True, max_length=255)


class OTPRequest(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)


class OTPVerificationRequest(SQLModel):
    phone_no: int = Field(nullable=False, ge=1000000000, le=9999999999)
    otp: int = Field(nullable=False, ge=1000, le=9999)
