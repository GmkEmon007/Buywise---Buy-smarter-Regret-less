"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { AppShell } from "@/components/app-shell";
import { CardTilt } from "@/components/ui/card-tilt";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip
} from "recharts";
import { 
  TrendingUp, TrendingDown, Sparkles, CheckCircle2, 
  ArrowRight, Search, Plus, Send, RefreshCw, Star, 
  ShieldAlert, BadgePercent, AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RenderMarkdown } from "@/components/markdown";

const PIE_COLORS = ["#9EE55B", "#3b82f6", "#ef4444"];

const CHART_DATA = [
  { month: "Jan", income: 5000, expense: -2000 },
  { month: "Feb", income: 6200, expense: -3400 },
  { month: "Mar", income: 4100, expense: -1800 },
  { month: "Apr", income: 7500, expense: -4200 },
  { month: "May", income: 5900, expense: -2800 },
  { month: "Jun", income: 8300, expense: -4500 },
  { month: "Jul", income: 6800, expense: -3100 },
];

const PIE_DATA = [
  { name: "Rent & Living", value: 60 },
  { name: "Investment", value: 20 },
  { name: "Education", value: 20 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // AI assistant states
  const [query, setQuery] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello! Ask me anything about watchlist items, prices, or regret scores." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Currency states
  const [usdVal, setUsdVal] = useState("100.00");
  const [gbpVal, setGbpVal] = useState("77.00");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) return null;

  const handleSendQuery = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    setChatLog(prev => [...prev, { sender: "user", text: textToSend }]);
    setQuery("");
    setChatLoading(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    let aiText = "";
    let fetched = false;

    if (baseUrl) {
      try {
        const response = await fetch(`${baseUrl}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: textToSend }),
        });
        if (response.ok) {
          const data = await response.json();
          aiText = data.reply;
          fetched = true;
        }
      } catch (err) {
        console.error("Dashboard Chat API error:", err);
      }
    }

    if (!fetched) {
      await new Promise(r => setTimeout(r, 800));
      aiText = "Based on BuyWise market scans, that product has high satisfaction parameters. Check compare logs for more details.";
      const lower = textToSend.toLowerCase();
      if (lower.includes("watchlist") || lower.includes("price")) {
        aiText = "Your active watchlist has 3 items. Sony WH-1000XM5 has an imminent 82% price drop prediction.";
      } else if (lower.includes("regret") || lower.includes("avoid")) {
        aiText = "We found thermal throttling complaints for Dell XPS 13, avoiding a potential buyer regret risk.";
      }
    }

    setChatLog(prev => [...prev, { sender: "ai", text: aiText }]);
    setChatLoading(false);
  };

  const handleConvert = () => {
    const val = parseFloat(usdVal);
    if (!isNaN(val)) {
      setGbpVal((val * 0.77).toFixed(2));
    }
  };

  const recentAnalyses = [
    { name: "MacBook Air M4", category: "Laptop", score: 94, status: "Strong Buy", price: "$1,099", badge: "badge-teal" },
    { name: "Sony WH-1000XM5", category: "Audio", score: 80, status: "Buy on Discount", price: "$279", badge: "badge-blue" },
    { name: "RTX 5070", category: "GPU", score: 88, status: "Wait for Launch", price: "$599", badge: "badge-blue" },
    { name: "iPhone 17", category: "Mobile", score: 76, status: "Risky Buy", price: "$999", badge: "badge-red" }
  ];

  return (
    <AppShell>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        
        {/* ── ROW 1: STATS ROW ── */}
        <ScrollReveal>
          <div className="fynix-row-1">
            
            {/* Card 1: Total Scans completed (Fynix green card) */}
            <div className="glass noise" style={{ 
              background: "var(--accent)", color: "#0c1204", 
              padding: 24, borderRadius: "var(--radius-lg)", 
              border: "1.5px solid var(--border)", display: "flex", 
              flexDirection: "column", justifyContent: "space-between", minHeight: 180 
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>
                    Total Scans Completed
                  </span>
                  <span style={{ background: "rgba(12, 18, 4, 0.08)", padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 800 }}>+4</span>
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, marginTop: 8, letterSpacing: "-1px" }}>
                  234,108 <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>Scans</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                <button 
                  onClick={() => router.push("/analysis")}
                  className="btn-lime" 
                  style={{ background: "#FFFFFF", color: "#0c1204", height: 38, padding: "0 16px", fontSize: 12, borderRadius: 10, border: "none" }}
                >
                  <Plus size={14} /> Scan Now
                </button>
                <button 
                  onClick={() => router.push("/watchlist")}
                  className="btn-lime" 
                  style={{ background: "#0c1204", color: "#FFFFFF", height: 38, padding: "0 16px", fontSize: 12, borderRadius: 10, border: "none" }}
                >
                  Manage <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Card 2: AI Enhancements (3 columns) */}
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 18 }}>
                AI Enhancements
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
                {[
                  { label: "Income", score: "82%", sub: "Avg Buy Score", trend: "+14.78%" },
                  { label: "Expense", score: "42", sub: "Avoided Regrets", trend: "-12.3%" },
                  { label: "Savings", score: "$185", sub: "Projected Savings", trend: "+8.2%" }
                ].map((col, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>{col.label}</span>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "var(--text)", marginTop: 2 }}>{col.score}</span>
                    <span style={{ fontSize: 11, color: col.trend.startsWith("+") ? "var(--teal)" : "var(--red)", fontWeight: 800, marginTop: 4 }}>
                      {col.trend} {col.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Finance Score (Buy Score progress) */}
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Finance Score
                  </span>
                  <span style={{ fontSize: 18, fontWeight: 900 }}>92%</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginTop: 8 }}>
                  Finance Quality: <span className="text-teal">Excellent</span>
                </div>
              </div>
              <div style={{ marginTop: "auto", paddingTop: 14 }}>
                <div style={{ width: "100%", height: 6, background: "var(--border)", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ width: "92%", height: "100%", background: "var(--accent)", borderRadius: 10 }} />
                </div>
              </div>
            </div>

          </div>
        </ScrollReveal>

        {/* ── ROW 2: CHART & ASSISTANT ── */}
        <ScrollReveal delay={0.1}>
          <div className="fynix-row-2">
            
            {/* Card 4: Cashflow double bar chart */}
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Cashflow
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>
                    $562,000 <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700 }}>June 2029 (Income: $6,000 / Expense: $4,000)</span>
                  </div>
                </div>
                <select className="input" style={{ width: 110, height: 32, padding: "0 10px", fontSize: 11, borderRadius: 8 }}>
                  <option>This Year</option>
                  <option>Last Year</option>
                </select>
              </div>

              <div style={{ height: 200 }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted)", fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--muted)", fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: "var(--bg-sec)", border: "1.5px solid var(--border)", borderRadius: 14 }} />
                      {/* Positive Lime Bar */}
                      <Bar dataKey="income" fill="var(--accent)" radius={[4, 4, 0, 0]} barSize={12} />
                      {/* Negative Dark Bar */}
                      <Bar dataKey="expense" fill="var(--text)" radius={[0, 0, 4, 4]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Card 5: AI Assistant Widget */}
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", minHeight: 310 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
                  <Sparkles size={16} className="text-teal" style={{ color: "var(--accent)" }} /> AI Assistant
                </span>
                <span className="badge badge-teal" style={{ fontSize: 10 }}>Active</span>
              </div>

              {/* Chat Feed */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14, maxHeight: 150 }}>
                {chatLog.map((msg, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                      background: msg.sender === "user" ? "var(--border-sec)" : "var(--bg)",
                      padding: "8px 12px", borderRadius: 12, fontSize: 12, maxWidth: "85%",
                      border: "1px solid var(--border)", fontWeight: 600
                    }}
                  >
                    <RenderMarkdown text={msg.text} />
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ alignSelf: "flex-start", display: "flex", gap: 4 }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", animation: "dotPulse 1.2s infinite ease-in-out" }} />
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", animation: "dotPulse 1.2s infinite ease-in-out", animationDelay: "0.2s" }} />
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", animation: "dotPulse 1.2s infinite ease-in-out", animationDelay: "0.4s" }} />
                  </div>
                )}
              </div>

              {/* Quick suggestions pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                {["Show watchlist status", "What regret risks avoided?"].map(tag => (
                  <button 
                    key={tag}
                    onClick={() => handleSendQuery(tag)}
                    className="tag"
                    style={{ fontSize: 10, padding: "4px 10px", borderRadius: 8, cursor: "pointer", border: "1px solid var(--border)" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form 
                onSubmit={e => { e.preventDefault(); handleSendQuery(query); }}
                style={{ display: "flex", gap: 8, border: "1.5px solid var(--border)", background: "var(--bg)", padding: 4, borderRadius: 12 }}
              >
                <input 
                  className="input"
                  placeholder="Ask anything..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  style={{ border: "none", background: "transparent", flex: 1, height: 32, fontSize: 12, paddingLeft: 8 }}
                />
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: 32, height: 32, padding: 0, borderRadius: 8, background: "var(--accent)", color: "var(--accent-dark)", border: "none" }}
                >
                  <Send size={12} />
                </button>
              </form>
            </div>

          </div>
        </ScrollReveal>

        {/* ── ROW 3: TRANSACTIONS / DONUT / CONVERTER ── */}
        <ScrollReveal delay={0.2}>
          <div className="fynix-row-3">
            
            {/* Card 6: Recent Scans Table */}
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Recent Transactions
                </span>
                <select className="input" style={{ width: 110, height: 32, padding: "0 10px", fontSize: 11, borderRadius: 8 }}>
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table className="data-table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Buy Score</th>
                      <th>Status</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAnalyses.map(row => (
                      <tr key={row.name}>
                        <td style={{ fontWeight: 800 }}>{row.name}</td>
                        <td style={{ color: "var(--muted)", fontWeight: 700 }}>{row.category}</td>
                        <td style={{ fontWeight: 800 }}>{row.score}</td>
                        <td>
                          <span className={`badge ${row.badge}`} style={{ fontSize: 11 }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800 }}>{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 7: Category Donut Statistic */}
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", textAlign: "left", fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
                Statistic
              </div>
              
              <div style={{ position: "relative", width: 130, height: 130 }}>
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={PIE_DATA} dataKey="value" innerRadius="60%" outerRadius="85%" paddingAngle={3}>
                        {PIE_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 900 }}>$3,500</span>
                  <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700 }}>Total Expense</span>
                </div>
              </div>

              <div style={{ width: "100%", marginTop: 14, display: "flex", flexDirection: "column", gap: 6, fontSize: 11, fontWeight: 700 }}>
                {PIE_DATA.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[idx] }} />
                      <span style={{ color: "var(--muted)" }}>{item.name}</span>
                    </div>
                    <span>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 8: Rate Exchange converter */}
            <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 14 }}>
                  Exchange
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>FROM (USD)</label>
                    <input 
                      className="input" 
                      value={usdVal} 
                      onChange={e => setUsdVal(e.target.value)} 
                      style={{ height: 36, fontSize: 13, borderRadius: 10, marginTop: 4 }} 
                    />
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                    <button 
                      onClick={handleConvert}
                      className="btn-ghost" 
                      style={{ width: 28, height: 28, padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <RefreshCw size={12} />
                    </button>
                  </div>

                  <div>
                    <label style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>TO (GBP - Rate 0.77)</label>
                    <input 
                      className="input" 
                      value={gbpVal} 
                      readOnly 
                      style={{ height: 36, fontSize: 13, borderRadius: 10, marginTop: 4, background: "var(--bg)" }} 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleConvert}
                className="btn-primary" 
                style={{ width: "100%", height: 38, borderRadius: 12, fontSize: 12, background: "var(--accent)", color: "#0c1204", border: "none", marginTop: 14 }}
              >
                Exchange
              </button>
            </div>

          </div>
        </ScrollReveal>

      </div>
    </AppShell>
  );
}
