import logging
import secrets
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("uvicorn.error")


class Settings(BaseSettings):
    app_name: str = "BuyWise API"
    database_url: str = "postgresql+psycopg://buywise:buywise_password@localhost:5432/buywise"
    redis_url: str = "redis://localhost:6379/0"
    openai_api_key: str | None = None
    gemini_api_key: str | None = None
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 60 * 24

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    if settings.jwt_secret == "change-me-in-production":
        logger.warning(
            "WARNING: Using default jwt_secret. Generating a random key for this session for security."
        )
        settings.jwt_secret = secrets.token_hex(32)
    return settings
