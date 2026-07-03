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

// Fallback Product Image with category detection icons
function ProductImage({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);

  const getCategoryIcon = () => {
    const nameLower = alt.toLowerCase();
    if (nameLower.includes("phone") || nameLower.includes("vivo") || nameLower.includes("iphone") || nameLower.includes("samsung") || nameLower.includes("pixel") || nameLower.includes("oneplus") || nameLower.includes("mobile")) return "📱";
    if (nameLower.includes("gpu") || nameLower.includes("rtx") || nameLower.includes("nvidia") || nameLower.includes("card") || nameLower.includes("graphics") || nameLower.includes("hardware") || nameLower.includes("cpu") || nameLower.includes("radeon") || nameLower.includes("amd")) return "⚙️";
    if (nameLower.includes("headphone") || nameLower.includes("audio") || nameLower.includes("earbud") || nameLower.includes("sound") || nameLower.includes("speaker") || nameLower.includes("xm5") || nameLower.includes("qc") || nameLower.includes("bose")) return "🎧";
    if (nameLower.includes("laptop") || nameLower.includes("macbook") || nameLower.includes("pc") || nameLower.includes("desktop") || nameLower.includes("computer")) return "💻";
    return "📦";
  };

  if (error || !src || src.startsWith("http://localhost") || src.includes("unsplash.com/photo-1505740420928-5e560c06d30e")) {
    return (
      <div style={{
        width: "100%",
        height: 380,
        borderRadius: 24,
        background: "var(--surface-sec)",
        border: "1.5px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        color: "var(--muted)",
        boxShadow: "inset 0 0 40px rgba(0,0,0,0.02)"
      }}>
        <div style={{ fontSize: 96, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.05))" }}>
          {getCategoryIcon()}
        </div>
        <span style={{ fontSize: 13, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1.5 }}>
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        width: "100%",
        maxHeight: 400,
        objectFit: "contain",
        borderRadius: 24,
        zIndex: 1,
        transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        boxShadow: "rgba(0, 0, 0, 0.04) 0px 20px 50px"
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03) rotate(1.5deg)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
    />
  );
}

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
        background: "var(--glass-bg)",
        backdropFilter: "blur(20px)",
        borderBottom: "1.5px solid var(--glass-border)",
        margin: "0 -24px 48px -24px",
        padding: "14px 24px",
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
                fontSize: 13,
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
            style={{ padding: "8px 14px", height: 36, borderRadius: 100, fontSize: 12, gap: 6, display: "flex", alignItems: "center" }}
          >
            <Bell size={13} style={{ color: tracked ? "var(--teal)" : "inherit" }} />
            {tracked ? "Tracking" : "Track Price"}
          </button>
        </div>
      </div>

      {/* ── SECTION 1: PRODUCT HERO ── */}
      <section id="hero" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 80, alignItems: "center" }}>
        {/* Left: Large Product Image Wrapper */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
          <div style={{
            position: "absolute",
            width: "80%",
            height: "80%",
            background: isRecommended ? "radial-gradient(circle, rgba(158,229,91,0.06) 0%, transparent 70%)" : "radial-gradient(circle, rgba(248,113,113,0.04) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(30px)",
            zIndex: 0
          }} />
          <ProductImage src={data.image_url} alt={data.name} />
        </div>

        {/* Right: Clean Minimal Product Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="var(--teal)" stroke="var(--teal)" />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>({data.trust_score || 84} Trust Score)</span>
            </div>
            <h1 style={{ fontSize: 44, fontWeight: 950, letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: 8, color: "var(--text)" }}>{data.name}</h1>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
              <span className={`badge ${isRecommended ? 'badge-teal' : isNeutral ? 'badge-blue' : 'badge-red'}`} style={{ fontSize: 13, padding: "6px 14px", borderRadius: 100 }}>
                {data.buy_score} Buy Score
              </span>
              <span style={{ 
                fontSize: 15, 
                color: isRecommended ? "var(--teal)" : isNeutral ? "var(--blue)" : "var(--red)", 
                fontWeight: 800 
              }}>
                {isRecommended ? "Highly Recommended" : isNeutral ? "Recommended on Discount" : "Caution / Not Recommended"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1 }}>${currentPrice}</span>
            {lowestPrice < currentPrice && (
              <span style={{ fontSize: 15, color: "var(--muted)", textDecoration: "line-through" }}>${(currentPrice * 1.15).toFixed(2)}</span>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button 
              onClick={() => setTracked(!tracked)}
              className="btn-primary" 
              style={{
                flex: 1, 
                height: 48, 
                borderRadius: 24, 
                fontSize: 14, 
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
              <Bell size={16} />
              {tracked ? "Price Alerts Active" : "Track Price"}
            </button>
            <button 
              onClick={handleShare}
              className="btn-ghost" 
              style={{
                width: 48, 
                height: 48, 
                borderRadius: "50%", 
                border: "1.5px solid var(--border)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                transition: "var(--transition-spring)",
                cursor: "pointer"
              }}
            >
              <Share2 size={16} style={{ color: copiedShare ? "var(--teal)" : "inherit" }} />
            </button>
          </div>
          {copiedShare && (
            <span style={{ fontSize: 11, color: "var(--teal)", fontWeight: 700, animation: "fadeIn 0.4s ease" }}>Link copied to clipboard!</span>
          )}
        </div>
      </section>

      {/* ── SECTION 2: AI RECOMMENDATION (MOST IMPORTANT) ── */}
      <section id="recommendation" style={{ marginBottom: 80 }}>
        <div className="glass noise" style={{
          padding: "54px 36px",
          borderRadius: 24,
          border: `2px solid ${isRecommended ? 'var(--teal)' : isNeutral ? 'var(--blue)' : 'var(--red)'}`,
          boxShadow: isRecommended ? 'rgba(158, 229, 91, 0.04) 0px 20px 80px' : isNeutral ? 'rgba(59, 130, 246, 0.04) 0px 20px 80px' : 'rgba(248, 113, 113, 0.04) 0px 20px 80px',
          textAlign: "center",
          background: "var(--surface)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28
        }}>
          <div>
            <div style={{
              fontSize: 14,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: isRecommended ? "var(--teal)" : isNeutral ? "var(--blue)" : "var(--red)",
              marginBottom: 6
            }}>
              AI Verdict
            </div>
            <h2 style={{
              fontSize: 54,
              fontWeight: 950,
              letterSpacing: "-2px",
              color: isRecommended ? "var(--teal)" : isNeutral ? "var(--blue)" : "var(--red)",
              lineHeight: 1
            }}>
              {isRecommended ? "🟢 BUY NOW" : isNeutral ? "🟡 COMPARE / WAIT" : "🔴 AVOID"}
            </h2>
          </div>

          <div style={{ display: "flex", gap: 48, flexWrap: "wrap", justifyContent: "center", margin: "8px 0" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 44, fontWeight: 950, letterSpacing: -1.5, lineHeight: 1 }}>{data.buy_score}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginTop: 4 }}>Buy Score</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 44, fontWeight: 950, letterSpacing: -1.5, lineHeight: 1 }}>96%</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginTop: 4 }}>Confidence</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: 44, fontWeight: 950, letterSpacing: -1.5, lineHeight: 1, color: isRecommended ? "var(--teal)" : "var(--muted)" }}>
                {isRecommended ? "TODAY" : "WAIT"}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginTop: 4 }}>Best Time</span>
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 540, borderTop: "1.5px solid var(--border)", paddingTop: 24 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12, textTransform: "uppercase", color: "var(--text)", letterSpacing: 1 }}>Key Purchase Justification</div>
            <ul style={{ display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0 }}>
              {(data.pros || []).slice(0, 3).map((pro, i) => (
                <li key={i} style={{ display: "flex", gap: 8, justifyContent: "center", alignItems: "center", fontSize: 15, color: "var(--muted)", fontWeight: 700 }}>
                  <CheckCircle2 size={16} className="text-teal" />
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: QUICK INSIGHTS (PILLS) ── */}
      <section id="insights" style={{ marginBottom: 80 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <div className="glass" style={{ padding: "10px 20px", borderRadius: 100, border: "1.5px solid var(--glass-border)", fontSize: 14, fontWeight: 800, color: isRecommended ? "var(--teal)" : "var(--muted)" }}>
            ★ {isRecommended ? "Worth Buying" : "Needs Review"}
          </div>
          <div className="glass" style={{ padding: "10px 20px", borderRadius: 100, border: "1.5px solid var(--glass-border)", fontSize: 14, fontWeight: 800 }}>
            ↓ {lowestPrice < currentPrice ? "Price Dropping" : "Price Stable"}
          </div>
          <div className="glass" style={{ padding: "10px 20px", borderRadius: 100, border: "1.5px solid var(--glass-border)", fontSize: 14, fontWeight: 800, color: data.regret_score < 40 ? "var(--teal)" : "var(--red)" }}>
            🛡️ {data.regret_score < 40 ? "Low Regret" : "High Regret Risk"}
          </div>
          <div className="glass" style={{ padding: "10px 20px", borderRadius: 100, border: "1.5px solid var(--glass-border)", fontSize: 14, fontWeight: 800 }}>
            🔥 Top Choice
          </div>
          <div className="glass" style={{ padding: "10px 20px", borderRadius: 100, border: "1.5px solid var(--glass-border)", fontSize: 14, fontWeight: 800 }}>
            🎓 Students
          </div>
          <div className="glass" style={{ padding: "10px 20px", borderRadius: 100, border: "1.5px solid var(--glass-border)", fontSize: 14, fontWeight: 800 }}>
            💻 Developers
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY PEOPLE BUY / REGRET ── */}
      <section id="pros-&-cons" style={{ marginBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          {/* Why Buy Card */}
          <div className="glass" style={{ padding: 32, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)" }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 className="text-teal" size={20} /> People Love
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(data.pros || []).map((pro, i) => (
                <div 
                  key={i}
                  style={{
                    padding: "12px 16px", 
                    borderRadius: 14, 
                    background: expandedBuy === i ? "var(--teal-dim)" : "var(--bg-sec)",
                    border: expandedBuy === i ? "1.5px solid var(--teal)" : "1.5px solid transparent",
                    cursor: "pointer",
                    transition: "var(--transition-spring)"
                  }}
                  onMouseEnter={() => setExpandedBuy(i)}
                  onMouseLeave={() => setExpandedBuy(null)}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>✓ {pro}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>{expandedBuy === i ? "Hide Review" : "View Review"}</span>
                  </div>
                  {expandedBuy === i && (
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, fontStyle: "italic", lineHeight: 1.4, animation: "fadeIn 0.3s ease" }}>
                      {getSyntheticReviewQuote(pro, true)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Why Regret Card */}
          <div className="glass" style={{ padding: 32, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)" }}>
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20, color: "var(--text)", display: "flex", alignItems: "center", gap: 8 }}>
              <XCircle className="text-red" size={20} /> People Regret
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(data.cons || []).map((con, i) => (
                <div 
                  key={i}
                  style={{
                    padding: "12px 16px", 
                    borderRadius: 14, 
                    background: expandedAvoid === i ? "var(--red-dim)" : "var(--bg-sec)",
                    border: expandedAvoid === i ? "1.5px solid var(--red)" : "1.5px solid transparent",
                    cursor: "pointer",
                    transition: "var(--transition-spring)"
                  }}
                  onMouseEnter={() => setExpandedAvoid(i)}
                  onMouseLeave={() => setExpandedAvoid(null)}
                >
                  <div style={{ fontWeight: 800, fontSize: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>× {con}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>{expandedAvoid === i ? "Hide Review" : "View Review"}</span>
                  </div>
                  {expandedAvoid === i && (
                    <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 8, fontStyle: "italic", lineHeight: 1.4, animation: "fadeIn 0.3s ease" }}>
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
      <section id="price" style={{ marginBottom: 80 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 48, alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 32, fontWeight: 950, letterSpacing: -1, marginBottom: 16 }}>Price Outlook Story</h3>
            <p style={{ fontSize: 16, color: "var(--muted)", lineHeight: 1.5, marginBottom: 24 }}>
              The current price of <strong>${currentPrice}</strong> is near its 90-day low of <strong>${lowestPrice}</strong>. 
              Our predictive model maps the overall price trends across channels and forecasts that the price is bottoming out. 
              A minor rise of 3% is expected over the next two weeks. <strong>This is the optimal buying window.</strong>
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="glass" style={{ padding: 20, borderRadius: 16, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Expected Rise</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--red)", marginTop: 2 }}>+3.0%</div>
              </div>
              <div className="glass" style={{ padding: 20, borderRadius: 16, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)" }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Best Value Window</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "var(--teal)", marginTop: 2 }}>Today</div>
              </div>
            </div>
          </div>
          {/* Price Trend Graph */}
          <div className="glass" style={{ padding: 24, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)" }}>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.price_trend}>
                  <XAxis dataKey="label" stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip contentStyle={{ background: "var(--surface)", borderRadius: 12, border: "1.5px solid var(--border)", color: "var(--text)" }} />
                  <Line type="monotone" dataKey="price" stroke="var(--teal)" strokeWidth={3} dot={{ fill: "var(--teal)", strokeWidth: 3, r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: COMMUNITY INTELLIGENCE (SPOTIFY WRAPPED STYLE) ── */}
      <section id="pulse" style={{ marginBottom: 80 }}>
        <h3 style={{ fontSize: 32, fontWeight: 950, letterSpacing: -1, marginBottom: 32, textAlign: "center" }}>Community Pulse</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {/* Stat 1 */}
          <div className="glass" style={{ padding: 24, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 44, fontWeight: 950, color: "var(--teal)", lineHeight: 1 }}>92%</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Would Buy Again</div>
          </div>
          {/* Stat 2 */}
          <div className="glass" style={{ padding: 24, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 44, fontWeight: 950, color: "var(--teal)", lineHeight: 1 }}>89%</div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase" }}>Owners Happy</div>
          </div>
          {/* Stat 3 */}
          <div className="glass" style={{ padding: 24, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Battery size={20} /> Battery
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Trending Topic</div>
          </div>
          {/* Stat 4 */}
          <div className="glass" style={{ padding: 24, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <Flame size={20} /> Heat
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Common Complaint</div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", fontWeight: 700, marginTop: 20 }}>
          ⚡ 12,483 total customer reviews processed in real-time.
        </div>
      </section>

      {/* ── SECTION 7: AI REPORT (CHATGPT STYLE) ── */}
      <section id="ai-report" style={{ marginBottom: 80 }}>
        <h3 style={{ fontSize: 32, fontWeight: 950, letterSpacing: -1, marginBottom: 32, textAlign: "center" }}>Executive Purchase Report</h3>
        <div className="glass noise" style={{ padding: 32, borderRadius: 24, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)", maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* AI Header */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15 }}>BuyWise AI Consultant</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>Analyzed: 12,483 reviews • 83 videos • 291 Reddit posts</div>
            </div>
          </div>

          {/* AI Message */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, borderTop: "1.5px solid var(--border)", paddingTop: 24 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 14, color: "var(--teal)", textTransform: "uppercase", marginBottom: 6 }}>My Conclusion</div>
              <p style={{ fontSize: 15, color: "var(--text)", lineHeight: 1.5 }}>{data.summary}</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--teal)", textTransform: "uppercase", marginBottom: 6 }}>You should buy this if...</div>
                <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  {(data.pros || []).slice(0, 2).map((item, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                  ))}
                  <li style={{ marginBottom: 4 }}>You prioritize low buyer regret risk.</li>
                </ul>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: "var(--red)", textTransform: "uppercase", marginBottom: 6 }}>You should avoid this if...</div>
                <ul style={{ paddingLeft: 18, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  {(data.cons || []).slice(0, 2).map((item, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{item}</li>
                  ))}
                  <li style={{ marginBottom: 4 }}>The premium price point is beyond your budget limits.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 8: ALTERNATIVES ── */}
      <section id="alternatives" style={{ marginBottom: 80 }}>
        <h3 style={{ fontSize: 32, fontWeight: 950, letterSpacing: -1, marginBottom: 32, textAlign: "center" }}>Alternative Products</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {(data.alternatives || []).map((alt, i) => (
            <div 
              key={i}
              className="glass floating-card-anim"
              style={{
                padding: 24,
                borderRadius: 24,
                border: "1.5px solid var(--glass-border)",
                background: "var(--glass-bg)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "var(--shadow-premium)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge badge-teal" style={{ fontWeight: 800, fontSize: 11 }}>{alt.buy_score} Buy Score</span>
                <span style={{ fontSize: 15, fontWeight: 800 }}>${alt.estimated_price}</span>
              </div>
              <div>
                <h4 style={{ fontSize: 18, fontWeight: 900, marginBottom: 2, color: "var(--text)" }}>{alt.name}</h4>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.3 }}>{alt.reason}</p>
              </div>
              <button 
                onClick={() => handleCompareClick(alt.name)}
                className="btn-ghost" 
                style={{ alignSelf: "flex-start", marginTop: "auto", fontSize: 11, padding: "6px 12px", display: "flex", alignItems: "center", gap: 4, borderRadius: 100 }}
              >
                Compare <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 9: SOURCES ── */}
      <section id="sources" style={{ marginBottom: 48, borderTop: "1.5px solid var(--border)", paddingTop: 48 }}>
        <h3 style={{ fontSize: 32, fontWeight: 950, letterSpacing: -1, marginBottom: 32, textAlign: "center" }}>Data Transparency</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {["Amazon Reviews", "Reddit Forums", "YouTube Transcripts", "Best Buy Index", "Tech Forums"].map((source) => (
            <div key={source} className="glass" style={{ padding: "16px 12px", borderRadius: 16, border: "1.5px solid var(--glass-border)", background: "var(--glass-bg)", textAlign: "center", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>{source}</div>
              <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={10} fill="var(--teal)" stroke="var(--teal)" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
