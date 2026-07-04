import json
import logging

from openai import OpenAI

from app.core.config import get_settings
from app.schemas.product import AlternativeProduct
from app.services.product_provider import ProductPayload

logger = logging.getLogger("uvicorn.error")


def clamp(value: int) -> int:
    return max(0, min(100, value))


def parse_int(value, default: int = 0) -> int:
    if value is None:
        return default
    if isinstance(value, (int, float)):
        return int(value)
    try:
        cleaned = "".join(c for c in str(value) if c.isdigit() or c == '-')
        return int(cleaned) if cleaned else default
    except Exception:
        return default


def parse_float(value, default: float = 0.0) -> float:
    if value is None:
        return default
    if isinstance(value, (int, float)):
        return float(value)
    try:
        cleaned = "".join(c for c in str(value) if c.isdigit() or c == '.')
        return float(cleaned) if cleaned else default
    except Exception:
        return default


class PurchaseAnalyzer:

    def __init__(self) -> None:
        settings = get_settings()
        self.provider = "openai"
        self.model = "gpt-4o-mini"
        self.client = None

        if settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)
            self.provider = "openai"
            self.model = "gpt-4o-mini"
        elif settings.gemini_api_key:
            self.client = OpenAI(
                api_key=settings.gemini_api_key,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
            self.provider = "gemini"
            self.model = "gemini-2.5-flash"

    def analyze(self, product: ProductPayload, preferences: dict) -> dict:
        if self.client:
            try:
                return self._analyze_with_openai(product, preferences)
            except Exception as e:
                logger.error(f"AI Analyzer API request failed: {e}. Falling back to local analysis.")
        return self._fallback_analysis(product, preferences)

    def chat(self, message: str) -> str:
        if self.client:
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are BuyWise AI assistant, an expert consumer shopping assistant. Help the user compare products, understand buyer regret, find pricing trends, and pick the best value options. Keep responses concise, informative, and beautifully formatted in markdown."},
                        {"role": "user", "content": message},
                    ],
                    temperature=0.7,
                )
                return response.choices[0].message.content or "Sorry, I couldn't generate a response."
            except Exception as e:
                logger.error(f"Chat API request failed: {e}")
        return "I'm having trouble connecting to my AI service right now. However, based on local records, the Sony XM5, Bose Ultra, and Apple MacBook Air are all trending with high satisfaction scores."

    def _analyze_with_openai(self, product: ProductPayload, preferences: dict) -> dict:
        prompt = {
            "product": product.__dict__,
            "preferences": preferences,
            "instruction": (
                "Analyze the product and user preferences. Return a JSON object with the following fields: "
                "buy_score (int 0-100), regret_score (int 0-100), trust_score (int 0-100), "
                "sentiment (object with keys 'positive', 'neutral', 'negative' as integer percentages summing to 100), "
                "pros (list of strings, max 4), cons (list of strings, max 4), "
                "complaints (list of strings, max 4), risks (list of strings, max 4), "
                "summary (string summarizing the product and key purchase/regret factors), "
                "alternatives (list of objects, each containing: 'name' string, 'reason' string, "
                "'estimated_price' float, 'buy_score' int 0-100). "
                "Respond ONLY with the raw JSON string matching this exact schema."
            ),
        }
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are BuyWise, a precise consumer purchase intelligence analyst. Return valid compact JSON only matching the requested schema."},
                {"role": "user", "content": json.dumps(prompt)},
            ],
            temperature=0.2,
            response_format={"type": "json_object"} if self.provider == "openai" else None,
        )
        content_str = response.choices[0].message.content or "{}"
        if content_str.startswith("```"):
            lines = content_str.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            content_str = "\n".join(lines).strip()
        data = json.loads(content_str)
        return self._normalize(data)

    def _fallback_analysis(self, product: ProductPayload, preferences: dict) -> dict:
        text = " ".join(product.reviews).lower()
        complaint_hits = sum(word in text for word in ["warm", "creak", "high", "wind", "not perfect"])
        buy_score = clamp(84 - complaint_hits * 4)
        regret_score = clamp(24 + complaint_hits * 7)
        trust_score = clamp(78 + len(product.reviews))
        return self._normalize(
            {
                "buy_score": buy_score,
                "regret_score": regret_score,
                "trust_score": trust_score,
                "sentiment": {"positive": 68, "neutral": 20, "negative": 12},
                "pros": ["Strong noise cancellation", "Excellent battery life", "Clear microphone quality", "Useful app controls"],
                "cons": ["Premium price", "Ear cups can feel warm", "Outdoor wind noise affects calls"],
                "complaints": ["Long-session comfort varies", "Some hinge durability concerns", "Price feels high versus rivals"],
                "risks": ["Wait for a discount if price sensitivity is high", "Consider warranty coverage for moving parts"],
                "summary": f"{product.name} looks like a strong buy for users who value performance and convenience. The main regret drivers are comfort over long sessions, high price, and minor durability concerns.",
                "alternatives": [
                    {"name": "SoundCore Space One Pro", "reason": "Better value with strong battery life", "estimated_price": 179.99, "buy_score": 82},
                    {"name": "Bose QuietComfort Ultra", "reason": "Higher comfort and best-in-class ANC", "estimated_price": 329.99, "buy_score": 88},
                    {"name": "Sony WH-1000XM4", "reason": "Older model with frequent discounts", "estimated_price": 199.99, "buy_score": 85},
                ],
            }
        )

    def _normalize(self, data: dict) -> dict:
        alternatives = []
        for item in data.get("alternatives", [])[:4]:
            if isinstance(item, dict):
                try:
                    alternatives.append(AlternativeProduct(
                        name=str(item.get("name", "Alternative Product")),
                        reason=str(item.get("reason", "Good choice")),
                        estimated_price=parse_float(item.get("estimated_price", 0.0)),
                        buy_score=clamp(parse_int(item.get("buy_score", 75)))
                    ).model_dump())
                except Exception as e:
                    logger.warning(f"Failed to parse alternative dict: {item}. Error: {e}")
            elif isinstance(item, str):
                alternatives.append(AlternativeProduct(
                    name=item,
                    reason="Alternative choice",
                    estimated_price=0.0,
                    buy_score=75
                ).model_dump())

        if not alternatives:
            alternatives = [
                AlternativeProduct(name="Alternative A", reason="Alternative choice", estimated_price=0.0, buy_score=75).model_dump()
            ]

        sentiment_src = data.get("sentiment", {})
        pos = parse_int(sentiment_src.get("positive", 60))
        neu = parse_int(sentiment_src.get("neutral", 25))
        neg = parse_int(sentiment_src.get("negative", 15))
        total = pos + neu + neg
        if total > 0:
            pos = int((pos / total) * 100)
            neu = int((neu / total) * 100)
            neg = 100 - pos - neu
        else:
            pos, neu, neg = 60, 25, 15

        return {
            "buy_score": clamp(parse_int(data.get("buy_score", 75))),
            "regret_score": clamp(parse_int(data.get("regret_score", 25))),
            "trust_score": clamp(parse_int(data.get("trust_score", 75))),
            "sentiment": {"positive": pos, "neutral": neu, "negative": neg},
            "pros": list(data.get("pros", []))[:6],
            "cons": list(data.get("cons", []))[:6],
            "complaints": list(data.get("complaints", []))[:6],
            "risks": list(data.get("risks", []))[:6],
            "summary": str(data.get("summary", "BuyWise completed the product analysis.")),
            "alternatives": alternatives,
        }
