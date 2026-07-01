from app.schemas.product import PricePointOut


def demo_price_trend(current_price: float) -> list[PricePointOut]:
    multipliers = [1.16, 1.08, 1.12, 1.0, 0.96, 1.04, 1.0]
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Now"]
    return [PricePointOut(label=label, price=round(current_price * multiplier, 2)) for label, multiplier in zip(labels, multipliers)]
