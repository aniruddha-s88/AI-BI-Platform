from pathlib import Path
from dotenv import load_dotenv
import os


BASE_DIR = Path(__file__).resolve().parent.parent.parent

load_dotenv(BASE_DIR / ".env")

print("DATABASE_URL =", os.getenv("DATABASE_URL"))
print("SECRET_KEY =", os.getenv("SECRET_KEY"))


from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    GROQ_API_KEY: str  
    class Config:
            env_file = ".env"


settings = Settings()