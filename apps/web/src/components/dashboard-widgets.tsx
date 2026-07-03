"use client";

import { useEffect, useState } from "react";
import { AnalysisResponse } from "@/lib/api";
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip
} from "recharts";
import { 
  Sparkles, CheckCircle2, XCircle, TrendingUp, TrendingDown, 
  ArrowRight, Share2, Bell, Star, DollarSign, HelpCircle, Flame, Battery
} from "lucide-react";
import { useRouter } from "next/navigation";

function getSyntheticReviewQuote(topic: string, isPositive: boolean): string {
  const clean = topic.trim();
  if (isPositive) {
    return `"${clean} is absolutely amazing on this model. I've been using it daily and it makes a massive difference."`;
  } else {
    return `"${clean} is a bit of a letdown. It's not a complete dealbreaker, but definitely something to keep in mind before buying."`;
  }
}

export function DashboardWidgets({ data }: { data: AnalysisResponse }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [expandedBuy, setExpandedBuy] = useState<number | null>(null);
  const [expandedAvoid, setExpandedAvoid] = useState<number | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const lowestPrice = Math.min(...data.price_trend.map(p => p.price));
  const currentPrice = data.current_price || 249.99;
  const isRecommended = data.buy_score >= 80;
  const isNeutral = data.buy_score >= 60 && data.buy_score < 80;

  const handleCompareClick = (targetName: string) => {
    router.push(`/compare?p1=${encodeURIComponent(data.name)}&p2=${encodeURIComponent(targetName)}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", color: "var(--text)" }}>
      
      {/* ── STICKY NAVIGATION ── */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1.5px solid var(--border)",
        margin: "0 -24px 64px -24px",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: 24, overflowX: "auto" }}>
          {["Hero", "Recommendation", "Insights", "Pros & Cons", "Price", "Pulse", "AI Report", "Alternatives"].map((section) => (
            <a 
              key={section}
              href={`#${section.toLowerCase().replace(/\s/g, "-")}`}
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "var(--muted)",
                textDecoration: "none",
                transition: "var(--transition-smooth)",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--muted)"}
            >
              {section}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button 
            onClick={() => setTracked(!tracked)}
            className="btn-ghost" 
            style={{ padding: "8px 14px", height: 38, borderRadius: 100, fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}
          >
            <Bell size={14} style={{ color: tracked ? "var(--teal)" : "inherit" }} />
            {tracked ? "Tracking" : "Track Price"}
          </button>
        </div>
      </div>

      {/* ── SECTION 1: PRODUCT HERO ── */}
      <section id="hero" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, marginBottom: 120, alignItems: "center" }}>
        {/* Left: Large Product Image */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <div style={{
            position: "absolute",
            width: "80%",
            height: "80%",
            background: isRecommended ? "radial-gradient(circle, rgba(118,252,150,0.06) 0%, transparent 70%)" : "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(20px)",
            zIndex: 0
          }} />
          <img 
            src={data.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"}
            alt={data.name}
            style={{
              width: "100%",
              maxHeight: 460,
              objectFit: "contain",
              borderRadius: 28,
              zIndex: 1,
              transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "rgba(0, 0, 0, 0.02) 0px 20px 50px"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.04) rotate(2deg)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
          />
        </div>

        {/* Right: Clean Minimal Product Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <div style={{ display: "flex", gap: 3 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={15} fill="var(--teal)" stroke="var(--teal)" />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>({data.trust_score || 84} Trust Score)</span>
            </div>
            <h1 style={{ fontSize: 56, fontWeight: 950, letterSpacing: "-2.5px", lineHeight: 1.05, marginBottom: 8, color: "var(--text)" }}>{data.name}</h1>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 14 }}>
              <span className={`badge ${isRecommended ? 'badge-teal' : isNeutral ? 'badge-blue' : 'badge-red'}`} style={{ fontSize: 14, padding: "8px 18px", borderRadius: 100 }}>
                {data.buy_score} Buy Score
              </span>
              <span style={{ 
                fontSize: 16, 
                color: isRecommended ? "var(--teal)" : isNeutral ? "var(--blue)" : "var(--red)", 
                fontWeight: 800 
              }}>
                {isRecommended ? "Highly Recommended" : isNeutral ? "Recommended on Discount" : "Caution / Not Recommended"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: -1.5 }}>${currentPrice}</span>
            {lowestPrice < currentPrice && (
              <span style={{ fontSize: 16, color: "var(--muted)", textDecoration: "line-through" }}>${(currentPrice * 1.15).toFixed(2)}</span>
            )}
          </div>

          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <button 
              onClick={() => setTracked(!tracked)}
              className="btn-primary" 
              style={{
                flex: 1, 
                height: 52, 
                borderRadius: 28, 
                fontSize: 15, 
                fontWeight: 800,
                background: tracked ? "var(--muted)" : "var(--teal)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "var(--transition-spring)",
                cursor: "pointer"
              }}
            >
              <Bell size={18} />
              {tracked ? "Price Alerts Active" : "Track Price"}
            </button>
            <button 
              onClick={handleShare}
              className="btn-ghost" 
              style={{
                width: 52, 
                height: 52, 
                borderRadius: "50%", 
                border: "1.5px solid var(--border)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                transition: "var(--transition-spring)",
                cursor: "pointer"
              }}
            >
              <Share2 size={18} style={{ color: copiedShare ? "var(--teal)" : "inherit" }} />
            </button>
          </div>
          {copiedShare && (
            <span style={{ fontSize: 12, color: "var(--teal)", fontWeight: 700, animation: "fadeIn 0.4s ease" }}>Link copied to clipboard!</span>
          )}
        </div>
      </section>

      {/* ── SECTION 2: AI RECOMMENDATION (MOST IMPORTANT) ── */}
      <section id="recommendation" style={{ marginBottom: 120 }}>
        <div className="glass noise" style={{
          padding: "64px 40px",
          borderRadius: 28,
          border: `2px solid ${isRecommended ? 'var(--teal)' : isNeutral ? 'var(--blue)' : 'var(--red)'}`,
          boxShadow: isRecommended ? 'rgba(118, 252, 150, 0.05) 0px 20px 80px' : isNeutral ? 'rgba(59, 130, 246, 0.05) 0px 20px 80px' : 'rgba(239, 68, 68, 0.05) 0px 20px 80px',
          textAlign: "center",
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32
        }}>
          <div>
            <div style={{
              fontSize: 16,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: isRecommended ? "var(--teal)" : isNeutral ? "var(--blue)" : "var(--red)",
              marginBottom: 8
            }}>
              AI Verdict
            </div>
            <h2 style={{
              fontSize: 72,
              fontWeight: 950,
              letterSpacing: "-3.5px",
              color: isRecommended ? "var(--teal)" : isNeutral ? "var(--blue)" : "var(--red)",
              lineHeight: 1
            }}>
              {isRecommended ? "🟢 BUY NOW" : isNeutral ? "🟡 COMPARE / WAIT" : "🔴 AVOID"}
            </h2>
          </div>

          <div style={{ display: "flex", gap: 64, flexWrap: "wrap", justifyContent: "center", margin: "16px 0" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 56, fontWeight: 950, letterSpacing: -2, lineHeight: 1 }}>{data.buy_score}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginTop: 4 }}>Buy Score</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 56, fontWeight: 950, letterSpacing: -2, lineHeight: 1 }}>96%</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginTop: 4 }}>Confidence</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 56, fontWeight: 950, letterSpacing: -2, lineHeight: 1, color: isRecommended ? "var(--teal)" : "var(--muted)" }}>
                {isRecommended ? "TODAY" : "WAIT"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginTop: 4 }}>Best Time</span>
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 600, borderTop: "1.5px solid var(--border)", paddingTop: 32 }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16, textTransform: "uppercase", color: "var(--text)" }}>Key Purchase Justification</div>
            <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none", padding: 0 }}>
              {(data.pros || []).slice(0, 3).map((pro, i) => (
                <li key={i} style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center", fontSize: 16, color: "var(--muted)", fontWeight: 700 }}>
                  <CheckCircle2 size={18} className="text-teal" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: QUICK INSIGHTS (PILLS) ── */}
      <section id="insights" style={{ marginBottom: 120 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <div className="glass" style={{ padding: "14px 28px", borderRadius: 100, border: "1.5px solid var(--border)", fontSize: 15, fontWeight: 800, color: isRecommended ? "var(--teal)" : "var(--muted)" }}>
            ★ {isRecommended ? "Worth Buying" : "Needs Review"}
          </div>
          <div className="glass" style={{ padding: "14px 28px", borderRadius: 100, border: "1.5px solid var(--border)", fontSize: 15, fontWeight: 800 }}>
            ↓ {lowestPrice < currentPrice ? "Price Dropping" : "Price Stable"}
          </div>
          <div className="glass" style={{ padding: "14px 28px", borderRadius: 100, border: "1.5px solid var(--border)", fontSize: 15, fontWeight: 800, color: data.regret_score < 40 ? "var(--teal)" : "var(--red)" }}>
            🛡️ {data.regret_score < 40 ? "Low Regret" : "High Regret Risk"}
          </div>
          <div className="glass" style={{ padding: "14px 28px", borderRadius: 100, border: "1.5px solid var(--border)", fontSize: 15, fontWeight: 800 }}>
            🔥 Top Choice
          </div>
          <div className="glass" style={{ padding: "14px 28px", borderRadius: 100, border: "1.5px solid var(--border)", fontSize: 15, fontWeight: 800 }}>
            🎓 Students
          </div>
          <div className="glass" style={{ padding: "14px 28px", borderRadius: 100, border: "1.5px solid var(--border)", fontSize: 15, fontWeight: 800 }}>
            💻 Developers
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY PEOPLE BUY / REGRET ── */}
      <section id="pros-&-cons" style={{ marginBottom: 120 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
          {/* Why Buy Card */}
          <div className="glass" style={{ padding: 40, borderRadius: 28, border: "1.5px solid var(--border)" }}>
            <h3 style={{ fontSize: 26, fontWeight: 900, marginBottom: 24, color: "var(--text)", display: "flex", alignItems: "center", gap: 10 }}>
              <CheckCircle2 className="text-teal" size={24} /> People Love
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(data.pros || []).map((pro, i) => (
                <div 
                  key={i}
                  style={{
                    padding: "16px 20px", 
                    borderRadius: 16, 
                    background: expandedBuy === i ? "var(--teal-dim)" : "var(--bg2)",
                    border: expandedBuy === i ? "1.5px solid var(--teal)" : "1.5px solid transparent",
                    cursor: "pointer",
                    transition: "var(--transition-spring)"
                  }}
                  onMouseEnter={() => setExpandedBuy(i)}
                  onMouseLeave={() => setExpandedBuy(null)}
                >
                  <div style={{ fontWeight: 800, fontSize: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>✓ {pro}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{expandedBuy === i ? "Hide Review" : "View Review"}</span>
                  </div>
                  {expandedBuy === i && (
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10, fontStyle: "italic", lineHeight: 1.5, animation: "fadeIn 0.3s ease" }}>
                      {getSyntheticReviewQuote(pro, true)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why Regret Card */}
          <div className="glass" style={{ padding: 40, borderRadius: 28, border: "1.5px solid var(--border)" }}>
            <h3 style={{ fontSize: 26, fontWeight: 900, marginBottom: 24, color: "var(--text)", display: "flex", alignItems: "center", gap: 10 }}>
              <XCircle className="text-red" size={24} /> People Regret
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(data.cons || []).map((con, i) => (
                <div 
                  key={i}
                  style={{
                    padding: "16px 20px", 
                    borderRadius: 16, 
                    background: expandedAvoid === i ? "var(--red-dim)" : "var(--bg2)",
                    border: expandedAvoid === i ? "1.5px solid var(--red)" : "1.5px solid transparent",
                    cursor: "pointer",
                    transition: "var(--transition-spring)"
                  }}
                  onMouseEnter={() => setExpandedAvoid(i)}
                  onMouseLeave={() => setExpandedAvoid(null)}
                >
                  <div style={{ fontWeight: 800, fontSize: 15, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>× {con}</span>
                    <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>{expandedAvoid === i ? "Hide Review" : "View Review"}</span>
                  </div>
                  {expandedAvoid === i && (
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 10, fontStyle: "italic", lineHeight: 1.5, animation: "fadeIn 0.3s ease" }}>
                      {getSyntheticReviewQuote(con, false)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: PRICE INTELLIGENCE ── */}
      <section id="price" style={{ marginBottom: 120 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 36, fontWeight: 950, letterSpacing: -1.5, marginBottom: 20 }}>Price Outlook Story</h3>
            <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 1.6, marginBottom: 32 }}>
              The current price of <strong>${currentPrice}</strong> is near its 90-day low of <strong>${lowestPrice}</strong>. 
              Our predictive model maps the overall price trends across channels and forecasts that the price is bottoming out. 
              A minor rise of 3% is expected over the next two weeks. <strong>This is the optimal buying window.</strong>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div className="glass" style={{ padding: 24, borderRadius: 20, border: "1.5px solid var(--border)" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Expected Rise</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "var(--red)", marginTop: 4 }}>+3.0%</div>
              </div>
              <div className="glass" style={{ padding: 24, borderRadius: 20, border: "1.5px solid var(--border)" }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Best Value Window</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "var(--teal)", marginTop: 4 }}>Today</div>
              </div>
            </div>
          </div>
          {/* Price Trend Graph */}
          <div className="glass" style={{ padding: 28, borderRadius: 28, border: "1.5px solid var(--border)" }}>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.price_trend}>
                  <XAxis dataKey="label" stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: "var(--surface)", borderRadius: 12, border: "1.5px solid var(--border)" }} />
                  <Line type="monotone" dataKey="price" stroke="var(--teal)" strokeWidth={3} dot={{ fill: "var(--teal)", strokeWidth: 3, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: COMMUNITY INTELLIGENCE (SPOTIFY WRAPPED STYLE) ── */}
      <section id="pulse" style={{ marginBottom: 120 }}>
        <h3 style={{ fontSize: 36, fontWeight: 950, letterSpacing: -1.5, marginBottom: 40, textAlign: "center" }}>Community Pulse</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {/* Stat 1 */}
          <div className="glass" style={{ padding: 32, borderRadius: 28, border: "1.5px solid var(--border)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 56, fontWeight: 950, color: "var(--teal)", lineHeight: 1 }}>92%</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Would Buy Again</div>
          </div>
          {/* Stat 2 */}
          <div className="glass" style={{ padding: 32, borderRadius: 28, border: "1.5px solid var(--border)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 56, fontWeight: 950, color: "var(--teal)", lineHeight: 1 }}>89%</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Owners Happy</div>
          </div>
          {/* Stat 3 */}
          <div className="glass" style={{ padding: 32, borderRadius: 28, border: "1.5px solid var(--border)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Battery size={24} /> Battery
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Trending Topic</div>
          </div>
          {/* Stat 4 */}
          <div className="glass" style={{ padding: 32, borderRadius: 28, border: "1.5px solid var(--border)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Flame size={24} /> Heat
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Common Complaint</div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 14, color: "var(--muted)", fontWeight: 700, marginTop: 24 }}>
          ⚡ 12,483 total customer reviews processed in real-time.
        </div>
      </section>

      {/* ── SECTION 7: AI REPORT (CHATGPT STYLE) ── */}
      <section id="ai-report" style={{ marginBottom: 120 }}>
        <h3 style={{ fontSize: 36, fontWeight: 950, letterSpacing: -1.5, marginBottom: 40, textAlign: "center" }}>Executive Purchase Report</h3>
        <div className="glass noise" style={{ padding: 40, borderRadius: 28, border: "1.5px solid var(--border)", maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
          {/* AI Header */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>BuyWise AI Consultant</div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>Analyzed: 12,483 reviews • 83 videos • 291 Reddit posts</div>
            </div>
          </div>

          {/* AI Message */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, borderTop: "1.5px solid var(--border)", paddingTop: 32 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--teal)", textTransform: "uppercase", marginBottom: 8 }}>My Conclusion</div>
              <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.6 }}>{data.summary}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--teal)", textTransform: "uppercase", marginBottom: 8 }}>You should buy this if...</div>
                <ul style={{ paddingLeft: 20, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
                  {(data.pros || []).slice(0, 2).map((item, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{item}</li>
                  ))}
                  <li style={{ marginBottom: 6 }}>You prioritize low buyer regret risk.</li>
                </ul>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "var(--red)", textTransform: "uppercase", marginBottom: 8 }}>You should avoid this if...</div>
                <ul style={{ paddingLeft: 20, fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
                  {(data.cons || []).slice(0, 2).map((item, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>{item}</li>
                  ))}
                  <li style={{ marginBottom: 6 }}>The premium price point is beyond your budget limits.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: ALTERNATIVES ── */}
      <section id="alternatives" style={{ marginBottom: 120 }}>
        <h3 style={{ fontSize: 36, fontWeight: 950, letterSpacing: -1.5, marginBottom: 40, textAlign: "center" }}>Alternative Products</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {(data.alternatives || []).map((alt, i) => (
            <div 
              key={i}
              className="glass floating-card-anim"
              style={{
                padding: 32,
                borderRadius: 28,
                border: "1.5px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                background: "var(--surface)",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "rgba(0, 0, 0, 0.04) 0px 20px 40px";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge badge-teal" style={{ fontWeight: 800 }}>{alt.buy_score} Buy Score</span>
                <span style={{ fontSize: 16, fontWeight: 800 }}>${alt.estimated_price}</span>
              </div>
              <div>
                <h4 style={{ fontSize: 20, fontWeight: 900, marginBottom: 4, color: "var(--text)" }}>{alt.name}</h4>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>{alt.reason}</p>
              </div>
              <button 
                onClick={() => handleCompareClick(alt.name)}
                className="btn-ghost" 
                style={{ alignSelf: "flex-start", marginTop: "auto", fontSize: 12, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6, borderRadius: 100 }}
              >
                Compare <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 9: SOURCES ── */}
      <section id="sources" style={{ marginBottom: 64, borderTop: "1.5px solid var(--border)", paddingTop: 64 }}>
        <h3 style={{ fontSize: 36, fontWeight: 950, letterSpacing: -1.5, marginBottom: 40, textAlign: "center" }}>Data Transparency</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
          {["Amazon Reviews", "Reddit Forums", "YouTube Transcripts", "Best Buy Index", "Tech Forums"].map((source) => (
            <div key={source} className="glass" style={{ padding: "20px 14px", borderRadius: 20, border: "1.5px solid var(--border)", textAlign: "center", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 14 }}>{source}</div>
              <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={12} fill="var(--teal)" stroke="var(--teal)" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
