from pathlib import Path
from dotenv import load_dotenv
import os


BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PROFILE = os.getenv("APP_ENV", "local").lower()

profile_file = BASE_DIR / f".env.{ENV_PROFILE}"
if profile_file.exists():
    load_dotenv(profile_file, override=True)

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
            env_file = None


settings = Settings()
