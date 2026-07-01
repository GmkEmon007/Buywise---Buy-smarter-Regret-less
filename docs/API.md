# BuyWise REST API

Base URL: `http://localhost:8000/api`

Interactive docs are available at `http://localhost:8000/docs` when the API is running.

## Health

`GET /health`

Returns service status.

```json
{ "status": "ok", "service": "buywise-api" }
```

## Register

`POST /auth/register`

```json
{
  "email": "buyer@example.com",
  "full_name": "Demo Buyer",
  "password": "secure-password",
  "preferences": {
    "priorities": ["value", "reliability", "low regret"]
  }
}
```

## Login

`POST /auth/login`

```json
{
  "email": "buyer@example.com",
  "password": "secure-password"
}
```

## Analyze Product

`POST /analysis`

```json
{
  "query": "Sony WH-1000XM5",
  "preferences": {
    "budget": 300,
    "priorities": ["comfort", "battery", "warranty"]
  }
}
```

Response:

```json
{
  "product_id": "uuid",
  "name": "Sony WH-1000XM5",
  "brand": "Sony",
  "current_price": 249.99,
  "buy_score": 84,
  "regret_score": 22,
  "trust_score": 89,
  "sentiment": { "positive": 68, "neutral": 20, "negative": 12 },
  "pros": ["Strong noise cancellation"],
  "cons": ["Premium price"],
  "complaints": ["Ear cups can feel warm"],
  "risks": ["Check return window for comfort fit"],
  "summary": "AI-generated purchase intelligence summary.",
  "alternatives": [
    {
      "name": "Alternative product",
      "reason": "Better value",
      "estimated_price": 199.99,
      "buy_score": 86
    }
  ],
  "price_trend": [{ "label": "Now", "price": 249.99 }]
}
```

## Recommendations

`GET /recommendations`

Returns personalized recommendation cards. In production this should read from user preferences, analysis history, and collaborative/product intelligence models.
