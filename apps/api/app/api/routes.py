from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.models import Analysis, Product, ProductReview, User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.schemas.product import AnalysisResponse, ProductSubmit
from app.services.ai_analyzer import PurchaseAnalyzer
from app.services.auth import create_access_token, hash_password, verify_password
from app.services.product_provider import DemoProductProvider
from app.services.scoring import demo_price_trend

router = APIRouter()


@router.get("/health")
def health() -> dict:
    return {"status": "ok", "service": "buywise-api"}


@router.post("/auth/register", response_model=TokenResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> TokenResponse:
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    user = User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        preferences=payload.preferences,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenResponse(access_token=create_access_token(user.id))


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return TokenResponse(access_token=create_access_token(user.id))


@router.post("/analysis", response_model=AnalysisResponse)
def analyze_product(payload: ProductSubmit, db: Session = Depends(get_db)) -> AnalysisResponse:
    provider = DemoProductProvider()
    product_payload = provider.fetch(payload.query)
    product = Product(
        canonical_url=payload.query if payload.query.startswith("http") else None,
        name=product_payload.name,
        brand=product_payload.brand,
        category=product_payload.category,
        image_url=product_payload.image_url,
        current_price=product_payload.current_price,
    )
    db.add(product)
    db.flush()

    for review in product_payload.reviews:
        db.add(ProductReview(product_id=product.id, source="demo", body=review))

    result = PurchaseAnalyzer().analyze(product_payload, payload.preferences)
    analysis = Analysis(product_id=product.id, **result)
    db.add(analysis)
    db.commit()
    db.refresh(product)

    return AnalysisResponse(
        product_id=product.id,
        name=product.name,
        brand=product.brand,
        image_url=product.image_url,
        current_price=float(product.current_price or 0),
        price_trend=demo_price_trend(float(product.current_price or 0)),
        **result,
    )


@router.get("/recommendations")
def recommendations() -> dict:
    return {
        "items": [
            {"name": "Logitech MX Master 4", "category": "Productivity", "fit": "Ergonomic, high-trust accessory"},
            {"name": "Kindle Paperwhite", "category": "Reading", "fit": "Low regret, high long-term satisfaction"},
            {"name": "Anker 737 Power Bank", "category": "Travel", "fit": "Reliable alternative to unknown brands"},
        ]
    }
