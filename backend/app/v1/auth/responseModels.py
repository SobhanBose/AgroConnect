from sqlmodel import SQLModel, Field
from pydantic import BaseModel
from app.v1.utils.HTTPStatus import HTTPStatusCodes


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None

    model_config = {"from_attributes": True}


class ShowFarmer(SQLModel):
    description: str | None = None
    user: ShowUser

    model_config = {"from_attributes": True}


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str
