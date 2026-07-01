import logging
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings

logger = logging.getLogger("uvicorn.error")


class Base(DeclarativeBase):
    pass


settings = get_settings()
db_url = settings.database_url
engine = None

if "postgresql" in db_url:
    try:
        # Check connection quickly (timeout 2s) to avoid hanging
        temp_engine = create_engine(db_url, connect_args={"connect_timeout": 2})
        with temp_engine.connect() as conn:
            pass
        engine = temp_engine
        logger.info("Database: Connected to PostgreSQL successfully.")
    except Exception as e:
        logger.warning(
            f"Database: PostgreSQL connection failed: {e}. Falling back to local SQLite database (buywise.db)."
        )
        db_url = "sqlite:///buywise.db"

if engine is None:
    engine = create_engine(db_url)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def create_tables():
    # Lazy import to prevent circular dependency
    from app.models.models import User, Product, ProductReview, Analysis, PricePoint
    Base.metadata.create_all(bind=engine)
    logger.info("Database: All database tables synchronized successfully.")


create_tables()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
