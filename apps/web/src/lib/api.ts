export type AnalysisResponse = {
  product_id: string;
  name: string;
  brand?: string;
  image_url?: string;
  current_price?: number;
  buy_score: number;
  regret_score: number;
  trust_score: number;
  sentiment: Record<string, number>;
  pros: string[];
  cons: string[];
  complaints: string[];
  risks: string[];
  summary: string;
  alternatives: { name: string; reason: string; estimated_price: number; buy_score: number }[];
  price_trend: { label: string; price: number }[];
};

const fallback: AnalysisResponse = {
  product_id: "demo",
  name: "Premium Noise Cancelling Headphones",
  brand: "BuyWise Demo",
  image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  current_price: 249.99,
  buy_score: 80,
  regret_score: 52,
  trust_score: 84,
  sentiment: { positive: 68, neutral: 20, negative: 12 },
  pros: ["Strong noise cancellation", "Excellent battery life", "Clear microphone", "Useful app controls"],
  cons: ["Premium price", "Ear cups can feel warm", "Wind noise outdoors"],
  complaints: ["Long-session comfort varies", "Hinge durability concerns", "Expensive without discount"],
  risks: ["Wait for a discount if budget matters", "Check return window for comfort fit"],
  summary:
    "A strong buy for frequent travelers and focused work, with regret risk mostly tied to comfort, outdoor calls, and price sensitivity.",
  alternatives: [
    { name: "SoundCore Space One Pro", reason: "Better value and battery life", estimated_price: 179.99, buy_score: 82 },
    { name: "Bose QuietComfort Ultra", reason: "Higher comfort and premium ANC", estimated_price: 329.99, buy_score: 88 },
    { name: "Sony WH-1000XM4", reason: "Older model with frequent discounts", estimated_price: 199.99, buy_score: 85 },
  ],
  price_trend: [
    { label: "Jan", price: 289 },
    { label: "Feb", price: 269 },
    { label: "Mar", price: 279 },
    { label: "Apr", price: 249 },
    { label: "May", price: 239 },
    { label: "Jun", price: 259 },
    { label: "Now", price: 249 },
  ],
};

export async function analyzeProduct(
  query: string,
  preferences?: { priorities: string[]; custom?: string }
): Promise<AnalysisResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) return fallback;

  try {
    const response = await fetch(`${baseUrl}/api/analysis`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query, 
        preferences: preferences || { priorities: ["value", "reliability", "low regret"] } 
      }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Analysis failed");
    return response.json();
  } catch {
    return { ...fallback, name: query || fallback.name };
  }
}
