import json
import logging
from dataclasses import dataclass

from openai import OpenAI

from app.core.config import get_settings

logger = logging.getLogger("uvicorn.error")


@dataclass
class ProductPayload:
    name: str
    brand: str
    category: str
    image_url: str
    current_price: float
    reviews: list[str]


class DemoProductProvider:
    """Uses LLM to synthesize realistic product data when online, falls back to dynamic templates."""

    def __init__(self) -> None:
        settings = get_settings()
        self.client = None
        self.model = "gemini-2.5-flash"

        if settings.openai_api_key:
            self.client = OpenAI(api_key=settings.openai_api_key)
            self.model = "gpt-4o-mini"
        elif settings.gemini_api_key:
            self.client = OpenAI(
                api_key=settings.gemini_api_key,
                base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
            )
            self.model = "gemini-2.5-flash"

    def fetch(self, query: str) -> ProductPayload:
        product_name = query if not query.startswith("http") else "Premium Electronic Product"

        # Default fallback values (Headphones)
        brand = "BuyWise Demo"
        category = "Consumer Electronics"
        image_url = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
        current_price = 249.99
        reviews = [
            "Battery life is excellent and the noise cancelling is impressive during flights.",
            "Sound quality is rich, but the ear cups get warm after two hours.",
            "I love the app controls and multipoint Bluetooth. The price is high though.",
            "Mine developed a hinge creak after three months, support replaced it quickly.",
            "Great for work calls. The microphone is clear, but wind noise outside is noticeable.",
            "Comfort is solid for short sessions, not perfect for all-day use.",
        ]

        # Check search query keywords to offer realistic category fallbacks
        lower = product_name.lower()
        if any(kw in lower for kw in ["vivo", "phone", "iphone", "samsung", "pixel", "mobile", "oneplus"]):
            brand = "SmartTech"
            category = "Smartphones"
            current_price = 799.99
            image_url = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80"
            reviews = [
                "The camera zoom is absolutely stunning, takes amazing night shots.",
                "Battery drains a bit fast when running heavy games or max brightness.",
                "The screen is bright and refresh rate is super smooth.",
                "Heating is noticeable under heavy loads like 4K recording.",
                "OS update support is great, but bloatware in regional variants is annoying.",
                "Excellent value compared to premium flagship competitors.",
            ]
        elif any(kw in lower for kw in ["rtx", "gpu", "nvidia", "card", "graphics", "radeon"]):
            brand = "NextGen GPU"
            category = "Computer Hardware"
            current_price = 599.99
            image_url = "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80"
            reviews = [
                "Frame rates in 4K are massive compared to last generation.",
                "It consumes a lot of power, make sure your PSU is 750W+.",
                "Fans are silent even at full load.",
                "Ray tracing performance is top notch, DLSS 3 is magic.",
                "The size is huge, barely fit into my mid-tower case.",
                "Extremely expensive, wait for a discount.",
            ]

        # If API key is available, query Gemini to generate 100% custom and realistic product data
        if self.client:
            try:
                prompt = (
                    f"Given the product name '{product_name}', generate a realistic brand, "
                    f"a product category, a realistic current retail price in USD (as a float), "
                    f"a specific high-quality search-related Unsplash image URL (e.g. a photo of the product type), "
                    f"and a list of exactly 6 realistic customer reviews expressing mixed opinions (praise and complaints). "
                    f"Format the response ONLY as a raw JSON object with keys: "
                    f"'brand' (str), 'category' (str), 'current_price' (float), 'image_url' (str), 'reviews' (list of strings)."
                )
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "You are a product data generator. Return valid JSON only."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                )
                content = response.choices[0].message.content or "{}"
                if content.startswith("```"):
                    lines = content.split("\n")
                    if lines[0].startswith("```"):
                        lines = lines[1:]
                    if lines and lines[-1].startswith("```"):
                        lines = lines[:-1]
                    content = "\n".join(lines).strip()

                data = json.loads(content)
                brand = str(data.get("brand", brand))
                category = str(data.get("category", category))
                current_price = float(data.get("current_price", current_price))
                image_url = str(data.get("image_url", image_url))
                reviews = list(data.get("reviews", reviews))[:6]

            except Exception as e:
                logger.error(f"Failed to fetch synthetic product data from AI: {e}. Using simulated defaults.")

        return ProductPayload(
            name=product_name[:120],
            brand=brand,
            category=category,
            image_url=image_url,
            current_price=current_price,
            reviews=reviews
        )
