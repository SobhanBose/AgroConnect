from sqlmodel import SQLModel, Field
from pydantic import BaseModel


class ShowUser(SQLModel):
    phone_no: int
    first_name: str | None = None
    last_name: str | None = None

    model_config = {"from_attributes": True}


class ShowFarmer(ShowUser):
    description: str | None = None

    model_config = {"from_attributes": True}
