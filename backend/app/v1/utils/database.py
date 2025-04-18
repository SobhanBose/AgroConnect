from typing import Annotated
from fastapi import Depends
from sqlmodel import Session, SQLModel, create_engine
from app.v1.config import settings

# from app.v1.main import CONFIG

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL, future=True)
# engine = create_engine(SQLALCHEMY_DATABASE_URL)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
