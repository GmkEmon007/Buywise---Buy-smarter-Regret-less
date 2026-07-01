from dataclasses import dataclass


@dataclass
class ProductPayload:
    name: str
    brand: str
    category: str
    image_url: str
    current_price: float
    reviews: list[str]


class DemoProductProvider:
    """Replace with Amazon PA-API, SerpAPI, Rainforest, Bright Data, or store APIs."""

    def fetch(self, query: str) -> ProductPayload:
        product_name = query if not query.startswith("http") else "Premium Noise Cancelling Headphones"
        return ProductPayload(
            name=product_name[:120],
            brand="BuyWise Demo",
            category="Consumer Electronics",
            image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
            current_price=249.99,
            reviews=[
                "Battery life is excellent and the noise cancelling is impressive during flights.",
                "Sound quality is rich, but the ear cups get warm after two hours.",
                "I love the app controls and multipoint Bluetooth. The price is high though.",
                "Mine developed a hinge creak after three months, support replaced it quickly.",
                "Great for work calls. The microphone is clear, but wind noise outside is noticeable.",
                "Comfort is solid for short sessions, not perfect for all-day use.",
            ],
        )
