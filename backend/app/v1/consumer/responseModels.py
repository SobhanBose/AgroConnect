from sqlmodel import SQLModel


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None

    model_config = {"from_attributes": True}


class HTTPExceptionResponse(SQLModel):
    status_code: int
    detail: str
