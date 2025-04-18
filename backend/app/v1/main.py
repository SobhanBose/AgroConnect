from fastapi import FastAPI, status, HTTPException

from app.v1.config import settings
from app.v1.utils import database
from app.v1.auth.router import router as auth_router

app = FastAPI()


@app.on_event("startup")
def on_startup():
    database.create_db_and_tables()


@app.get("/", status_code=status.HTTP_200_OK)
def read_root():
    return HTTPException(status_code=status.HTTP_200_OK, detail="Welcome to the API")


app.include_router(
    auth_router,
    prefix="/auth",
    tags=["auth"],
)
