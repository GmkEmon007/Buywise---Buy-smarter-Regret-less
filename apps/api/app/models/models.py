from datetime import datetime
from uuid import uuid4

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String)
    password_hash: Mapped[str] = mapped_column(String)
    preferences: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    canonical_url: Mapped[str | None] = mapped_column(Text)
    name: Mapped[str] = mapped_column(String, index=True)
    brand: Mapped[str | None] = mapped_column(String)
    category: Mapped[str | None] = mapped_column(String)
    image_url: Mapped[str | None] = mapped_column(Text)
    current_price: Mapped[float | None] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String, default="USD")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    reviews: Mapped[list["ProductReview"]] = relationship(back_populates="product")


class ProductReview(Base):
    __tablename__ = "product_reviews"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    source: Mapped[str] = mapped_column(String)
    rating: Mapped[float | None] = mapped_column(Numeric(3, 2))
    title: Mapped[str | None] = mapped_column(Text)
    body: Mapped[str] = mapped_column(Text)
    sentiment: Mapped[str | None] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    product: Mapped[Product] = relationship(back_populates="reviews")


class Analysis(Base):
    __tablename__ = "analyses"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    user_id: Mapped[str | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    buy_score: Mapped[int] = mapped_column(Integer)
    regret_score: Mapped[int] = mapped_column(Integer)
    trust_score: Mapped[int] = mapped_column(Integer)
    sentiment: Mapped[dict] = mapped_column(JSONB)
    pros: Mapped[list] = mapped_column(JSONB)
    cons: Mapped[list] = mapped_column(JSONB)
    complaints: Mapped[list] = mapped_column(JSONB)
    risks: Mapped[list] = mapped_column(JSONB)
    summary: Mapped[str] = mapped_column(Text)
    alternatives: Mapped[list] = mapped_column(JSONB)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class PricePoint(Base):
    __tablename__ = "price_points"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"))
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String, default="USD")
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
