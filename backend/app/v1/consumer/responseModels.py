from sqlmodel import SQLModel
from uuid import UUID


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None

    model_config = {"from_attributes": True}


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str

    model_config = {"from_attributes": True}
