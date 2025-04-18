from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()


class Settings(BaseSettings):
    APP_NAME: str = os.getenv("APP_NAME")
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
