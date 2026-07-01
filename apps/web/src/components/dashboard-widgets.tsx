"use client";

import { useEffect, useState } from "react";
import { AnalysisResponse } from "@/lib/api";
import { 
  AreaChart, Area, PieChart, Pie, Cell, 
  Tooltip, XAxis, YAxis, ResponsiveContainer, 
  LineChart, Line
} from "recharts";
import { 
  TrendingDown, TrendingUp, Sparkles, CheckCircle2, 
  XCircle, FileText, Youtube, MessageCircle, 
  BarChart3, HelpCircle, ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

const SEN_COLORS = ["#76FC96", "#3b82f6", "#ef4444"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ 
      fontSize: 12, fontWeight: 700, color: "var(--muted)", 
      textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 20, 
      display: "flex", alignItems: "center", gap: 8 
    }}>
      {children}
    </div>
  );
}

// Custom premium double-stroke gauge
function BigCircularGauge({ score, label, color, subtitle }: { score: number; label: string; color: string; subtitle: string }) {
  const r = 70;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "20px 10px" }}>
      <div style={{ position: "relative", width: 170, height: 170 }}>
        {/* Glow backing shadow for gauge value */}
        <div style={{
          position: "absolute", inset: 30, borderRadius: "50%",
          boxShadow: `0 0 40px ${color}12`,
          pointerEvents: "none"
        }} />
        <svg viewBox="0 0 170 170" style={{ transform: "rotate(-90deg)", width: 170, height: 170 }}>
          {/* Inner ring */}
          <circle cx={85} cy={85} r={r - 6} fill="none" stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
          {/* Outer ring background */}
          <circle cx={85} cy={85} r={r} fill="none" stroke="var(--border2)" strokeWidth={10} />
          {/* Active progress */}
          <circle cx={85} cy={85} r={r} fill="none" stroke={color}
            strokeWidth={10} strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={fill}
            style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 40, fontWeight: 900, color: "var(--text)", textShadow: `0 0 10px ${color}1a` }}>{score}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: 2 }}>{label}</span>
        </div>
      </div>
      <div style={{ textAlign: "center", fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>{subtitle}</div>
    </div>
  );
}

export function DashboardWidgets({ data }: { data: AnalysisResponse }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai" | "reddit" | "youtube">("ai");

  useEffect(() => setMounted(true), []);

  const sentiment = Object.entries(data.sentiment).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1), value,
  }));
  const lowestPrice = Math.min(...data.price_trend.map(p => p.price));

  const handleCompareClick = () => {
    router.push(`/compare?p1=${encodeURIComponent(data.name)}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      
      {/* ── HERO BANNER ── */}
      <div className="glass noise" style={{ 
        padding: "40px 36px", borderRadius: "var(--radius-lg)", 
        border: "1.5px solid var(--border)", display: "flex", 
        justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 28 
      }}>
        <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ 
            width: 108, height: 108, borderRadius: "var(--radius-md)", 
            background: "var(--bg2)", border: "1.5px solid var(--border)", 
            display: "flex", alignItems: "center", justifyContent: "center", 
            fontSize: 52, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" 
          }}>
            💻
          </div>
          <div>
            <div style={{ fontSize: 12, color: "var(--teal)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px" }}>Analysis Completed</div>
            <h2 style={{ fontSize: 42, fontWeight: 900, letterSpacing: -1.5, color: "var(--text)", marginTop: 6 }}>{data.name}</h2>
            <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
              <span className="badge badge-teal" style={{ fontSize: 13, padding: "6px 14px" }}>{data.buy_score} Buy Score</span>
              <span style={{ fontSize: 14, color: "var(--muted)", fontWeight: 700 }}>Highly Recommended</span>
            </div>
          </div>
        </div>

        {/* Floating AI Verdict Card */}
        <div className="glass" style={{ 
          padding: 28, borderRadius: "var(--radius-md)", border: "2px solid var(--teal)", 
          width: 340, boxShadow: "var(--teal-glow)", position: "relative",
          background: "var(--surface)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={16} className="text-teal" /> AI Verdict
            </span>
            <span className="badge badge-teal" style={{ fontWeight: 800 }}>Confidence 96%</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, color: "var(--teal)", marginBottom: 12, letterSpacing: -0.5 }}>Buy Now</div>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, listStyle: "none", fontSize: 13, color: "var(--muted)", fontWeight: 700 }}>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={15} className="text-teal" /> Lowest price in 3 months</li>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={15} className="text-teal" /> Battery metrics excellent</li>
            <li style={{ display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={15} className="text-teal" /> Long-term satisfaction very high</li>
          </ul>
        </div>
      </div>

      {/* ── SCORE ROW (3 CIRCLES) ── */}
      <div className="glass" style={{ borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", padding: 32 }}>
        <SectionLabel>◎ Buy score signals</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          <BigCircularGauge 
            score={data.buy_score} 
            label="Buy Score" 
            color="var(--teal)" 
            subtitle="Overall purchase score parameters" 
          />
          <BigCircularGauge 
            score={data.trust_score} 
            label="Community Trust" 
            color="var(--blue)" 
            subtitle="Verified reviews index" 
          />
          <BigCircularGauge 
            score={data.regret_score} 
            label="Regret Risk" 
            color="var(--red)" 
            subtitle="Projected buyer regret risk rate" 
          />
        </div>
      </div>

      {/* ── PRICE INTELLIGENCE ── */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        
        {/* Price History Chart */}
        <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <SectionLabel>△ Price Intelligence</SectionLabel>
            <div style={{ display: "flex", gap: 18 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>Current Price</div>
                <div style={{ fontSize: 20, fontWeight: 900 }}>${data.current_price}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>90-Day Low</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: "var(--teal)" }}>${lowestPrice}</div>
              </div>
            </div>
          </div>
          
          <div style={{ height: 210 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.price_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="var(--teal)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--muted)", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)", fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                  <Tooltip contentStyle={{ background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: 16, color: "var(--text)", fontSize: 12, fontWeight: 700 }} />
                  <Area type="monotone" dataKey="price" stroke="var(--teal)" strokeWidth={3} fillOpacity={1} fill="url(#chartGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Price Outlook Card */}
        <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <SectionLabel>Price Trend Forecast</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--teal-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)" }}>
                <TrendingDown size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 17 }}>Expected Trend</div>
                <div style={{ fontSize: 13, color: "var(--teal)", fontWeight: 800 }}>Price bottom imminent</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              Our ML model predicts a maximum price rise of 3% over the next 14 days. This is the **best time to buy**.
            </p>
          </div>
          <button className="btn-primary" style={{ width: "100%", borderRadius: 100, height: 44, fontSize: 14 }} onClick={() => router.push("/watchlist")}>
            Track Price Alerts
          </button>
        </div>
      </div>

      {/* ── WHY PEOPLE BUY VS REGRET ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        
        {/* Pros */}
        <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
          <SectionLabel>✓ Why People Buy</SectionLabel>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none" }}>
            {data.pros.map((pro, index) => (
              <li key={index} style={{ 
                display: "flex", gap: 12, fontSize: 14, color: "var(--text)", 
                fontWeight: 700, alignItems: "flex-start", background: "var(--bg2)", 
                padding: "12px 16px", borderRadius: 14, border: "1px solid var(--border)" 
              }}>
                <span className="text-teal" style={{ marginTop: 1 }}><CheckCircle2 size={16} /></span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
          <SectionLabel>× Why People Regret</SectionLabel>
          <ul style={{ display: "flex", flexDirection: "column", gap: 12, listStyle: "none" }}>
            {[...data.cons, ...data.risks].slice(0, 4).map((con, index) => (
              <li key={index} style={{ 
                display: "flex", gap: 12, fontSize: 14, color: "var(--text)", 
                fontWeight: 700, alignItems: "flex-start", background: "var(--bg2)", 
                padding: "12px 16px", borderRadius: 14, border: "1px solid var(--border)" 
              }}>
                <span className="text-red" style={{ marginTop: 1 }}><XCircle size={16} /></span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── AI SUMMARY / REDDIT / YOUTUBE TABS ── */}
      <div className="glass" style={{ borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", overflow: "hidden" }}>
        
        {/* Tab Headers */}
        <div style={{ display: "flex", borderBottom: "1.5px solid var(--border)", background: "var(--bg2)", padding: "4px 8px 0 8px" }}>
          {[
            { id: "ai", label: "AI Summary", icon: <FileText size={16} /> },
            { id: "reddit", label: "Reddit consensus", icon: <MessageCircle size={16} /> },
            { id: "youtube", label: "YouTube Review Synthesis", icon: <Youtube size={16} /> }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "16px 20px",
                border: "none", background: "none", cursor: "pointer",
                fontWeight: 800, fontSize: 14,
                color: activeTab === tab.id ? "var(--teal)" : "var(--muted)",
                borderBottom: activeTab === tab.id ? "3px solid var(--teal)" : "3px solid transparent",
                transition: "all 0.2s ease",
                borderRadius: "8px 8px 0 0"
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div style={{ padding: 32 }}>
          {activeTab === "ai" && (
            <article style={{ lineHeight: 1.8, fontSize: 16, color: "var(--muted)" }}>
              <h4 style={{ fontWeight: 900, fontSize: 20, color: "var(--text)", marginBottom: 14 }}>Executive Purchase Report</h4>
              <p style={{ marginBottom: 16 }}>{data.summary}</p>
              <p style={{ fontWeight: 700, color: "var(--text)" }}>If noise cancellation and battery health are your top priorities, this is an excellent choice. If budget or outdoor gaming is your focus, consider alternative products.</p>
            </article>
          )}

          {activeTab === "reddit" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <h5 style={{ fontWeight: 900, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>Most discussed opinions</h5>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>Redditors praise the headband comfort and call the soundstage exceptionally balanced. Frequent discussions mention the touch controls as slightly over-sensitive.</p>
              </div>
              <div style={{ borderLeft: "4px solid var(--teal)", paddingLeft: 18, background: "var(--bg2)", padding: 16, borderRadius: 14 }}>
                <h5 style={{ fontWeight: 900, fontSize: 16, color: "var(--text)", marginBottom: 8 }}>Most common complaints</h5>
                <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6 }}>"The ear cups can make your ears feel hot during long editing sessions." - 142 upvotes in r/headphones</p>
              </div>
            </div>
          )}

          {activeTab === "youtube" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="badge badge-teal">20 Videos Analyzed</span>
                <span style={{ fontSize: 14, color: "var(--text)", fontWeight: 800 }}>Overall consensus: Highly Recommended</span>
              </div>
              <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.7 }}>
                Top reviewers like MKBHD and Dave2D recommend this product for corporate travelers. Creators suggest turning off automatic wear detection if you prefer custom EQ behaviors.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── COMMUNITY INTELLIGENCE VISUALS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 24 }}>
        
        {/* Sentiment breakdown */}
        <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
          <SectionLabel><BarChart3 size={16} /> Sentiment Breakdown</SectionLabel>
          <div style={{ height: 170 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sentiment} dataKey="value" innerRadius="60%" outerRadius="85%" paddingAngle={4}>
                    {sentiment.map((_, i) => <Cell key={i} fill={SEN_COLORS[i % SEN_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${Number(v)}%`, "Sentiment"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 14 }}>
            {sentiment.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text)", fontWeight: 800 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: SEN_COLORS[i] }} />
                <span>{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment timeline */}
        <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
          <SectionLabel>Sentiment Timeline (Last 6 Months)</SectionLabel>
          <div style={{ height: 210 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: "Jan", positive: 60, negative: 18 },
                  { month: "Feb", positive: 65, negative: 14 },
                  { month: "Mar", positive: 62, negative: 15 },
                  { month: "Apr", positive: 70, negative: 10 },
                  { month: "May", positive: 68, negative: 12 },
                  { month: "Jun", positive: 72, negative: 8 }
                ]}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted)", fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted)", fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                  <Tooltip />
                  <Line type="monotone" dataKey="positive" stroke="var(--teal)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="negative" stroke="var(--red)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* ── ALTERNATIVE PRODUCTS ── */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--hint)", letterSpacing: "1.5px", marginBottom: 18 }}>Alternative Products</div>
        <div className="alternatives-grid">
          {data.alternatives.map(a => (
            <div key={a.name} className="glass interactive-card" style={{ padding: 24, borderRadius: 24, border: "1.5px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 12, alignItems: "center" }}>
                <div style={{ fontWeight: 900, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                <span className="badge badge-teal" style={{ flexShrink: 0 }}>{a.buy_score} Score</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 16, minHeight: 60 }}>{a.reason}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 900, fontSize: 18 }}>${a.estimated_price}</span>
                <button className="btn-ghost btn-sm" style={{ padding: "0 14px", height: 34, borderRadius: 8, fontSize: 12, fontWeight: 700 }} onClick={() => router.push(`/compare?p1=${encodeURIComponent(data.name)}&p2=${encodeURIComponent(a.name)}`)}>
                  Compare
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM CTA ── */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 32, marginBottom: 40 }}>
        <button className="btn-primary" style={{ padding: "0 36px", height: 50, borderRadius: 100 }} onClick={handleCompareClick}>
          Compare Similar Products <ArrowRight size={16} />
        </button>
      </div>

    </div>
  );
}
