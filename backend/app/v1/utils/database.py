from typing import Annotated

from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine

SQLALCHEMY_DATABASE_URL = "sqlite:///./app/v1/database.db"
# SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://admin:admin@34.131.168.232:5432/ehab"

# engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
engine = create_engine(SQLALCHEMY_DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
