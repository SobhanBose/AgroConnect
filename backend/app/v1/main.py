from fastapi import FastAPI
from dotenv import load_dotenv

from app.v1.utils import database
from app.v1.auth.router import router as auth_router

app = FastAPI()


@app.on_event("startup")
def on_startup():
    CONFIG = load_dotenv()
    database.create_db_and_tables()


@app.get("/")
def read_root():
    return {"Hello": "World"}


app.include_router(
    auth_router,
    prefix="/auth",
    tags=["auth"],
)
