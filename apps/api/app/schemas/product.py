from pydantic import BaseModel, Field, HttpUrl


class ProductSubmit(BaseModel):
    query: str = Field(min_length=2, examples=["Sony WH-1000XM5", "https://example.com/product"])
    preferences: dict = Field(default_factory=dict)


class AlternativeProduct(BaseModel):
    name: str
    reason: str
    estimated_price: float
    buy_score: int


class PricePointOut(BaseModel):
    label: str
    price: float


class AnalysisResponse(BaseModel):
    product_id: str
    name: str
    brand: str | None = None
    image_url: HttpUrl | None = None
    current_price: float | None = None
    buy_score: int
    regret_score: int
    trust_score: int
    sentiment: dict[str, int]
    pros: list[str]
    cons: list[str]
    complaints: list[str]
    risks: list[str]
    summary: str
    alternatives: list[AlternativeProduct]
    price_trend: list[PricePointOut]
