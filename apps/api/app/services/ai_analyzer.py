import json
import logging

from openai import OpenAI

from app.core.config import get_settings
from app.schemas.product import AlternativeProduct
from app.services.product_provider import ProductPayload

logger = logging.getLogger("uvicorn.error")


def clamp(value: int) -> int:
    return max(0, min(100, value))


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

    def _analyze_with_openai(self, product: ProductPayload, preferences: dict) -> dict:
        prompt = {
            "product": product.__dict__,
            "preferences": preferences,
            "instruction": "Return JSON with buy_score, regret_score, trust_score, sentiment, pros, cons, complaints, risks, summary, alternatives. Respond ONLY with the raw JSON string.",
        }
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": "You are BuyWise, a precise consumer purchase intelligence analyst. Return valid compact JSON only."},
                {"role": "user", "content": json.dumps(prompt)},
            ],
            temperature=0.2,
            response_format={"type": "json_object"} if self.provider == "openai" else None,
        )
        content_str = response.choices[0].message.content or "{}"
        # Strip markdown code blocks if Gemini returns them
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
        alternatives = [AlternativeProduct(**item).model_dump() for item in data.get("alternatives", [])[:4]]
        return {
            "buy_score": clamp(int(data.get("buy_score", 75))),
            "regret_score": clamp(int(data.get("regret_score", 25))),
            "trust_score": clamp(int(data.get("trust_score", 75))),
            "sentiment": data.get("sentiment", {"positive": 60, "neutral": 25, "negative": 15}),
            "pros": list(data.get("pros", []))[:6],
            "cons": list(data.get("cons", []))[:6],
            "complaints": list(data.get("complaints", []))[:6],
            "risks": list(data.get("risks", []))[:6],
            "summary": str(data.get("summary", "BuyWise completed the product analysis.")),
            "alternatives": alternatives,
        }
