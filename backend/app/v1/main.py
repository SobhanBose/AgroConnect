from fastapi import FastAPI, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.v1.config import settings
from app.v1.utils import database
from app.v1.dev_utils import seed

from app.v1.auth.router import router as auth_router
from app.v1.farmer.router import router as farmer_router
from app.v1.consumer.router import router as consumer_router
from app.v1.marketplace.router import router as marketplace_router
from app.v1.cart.router import router as cart_router
from app.v1.orders.router import router as orders_router


cors_origins = ["*"]
cors_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]


app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=cors_origins, allow_methods=cors_methods)


@app.on_event("startup")
def on_startup():
    database.create_db_and_tables()
    if settings.DEV_MODE:
        seed.create_test_user()


@app.get("/", status_code=status.HTTP_200_OK)
def home():
    return HTTPException(status_code=status.HTTP_200_OK, detail="Welcome to the API")


app.include_router(auth_router)
app.include_router(farmer_router)
app.include_router(consumer_router)
app.include_router(marketplace_router)
app.include_router(cart_router)
app.include_router(orders_router)
