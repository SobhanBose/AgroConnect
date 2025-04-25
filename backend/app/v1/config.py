from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

# load_dotenv()


class Settings(BaseSettings):
    APP_NAME: str
    DATABASE_URL: str
    DEV_MODE: bool
    TWILIO_ACCOUNT_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_PHONE_NO: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
