"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DashboardWidgets } from "@/components/dashboard-widgets";
import { AnalysisResponse, analyzeProduct } from "@/lib/api";
import { Search, Sparkles, TrendingUp, Cpu, Award } from "lucide-react";

const SUGGESTIONS = [
  { name: "Sony WH-1000XM5", icon: "🎧", desc: "Best-in-class headphones" },
  { name: "MacBook Air M4", icon: "💻", desc: "Premium developer laptop" },
  { name: "RTX 5070", icon: "🎮", desc: "Next-gen graphics card" },
  { name: "Vivo X200", icon: "📱", desc: "Flagship mobile display" }
];

function AnalysisPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get("q");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadStep, setLoadStep] = useState(0);

  // loading steps animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      setLoadStep(0);
      interval = setInterval(() => {
        setLoadStep((prev) => (prev < 3 ? prev + 1 : 3));
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      triggerAnalysis(queryParam);
    } else {
      setData(null);
    }
  }, [queryParam]);

  async function triggerAnalysis(searchQuery: string) {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await analyzeProduct(searchQuery);
      setData(result);
    } catch {
      setError("Analysis failed. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/analysis?q=${encodeURIComponent(query.trim())}`);
  }

  const handleSuggestionClick = (name: string) => {
    setQuery(name);
    router.push(`/analysis?q=${encodeURIComponent(name)}`);
  };

  const hasData = data && !loading;

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: hasData ? "auto" : "calc(100vh - 120px)",
      justifyContent: hasData ? "flex-start" : "center",
      transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
    }}>
      
      {/* ── SEARCH CARD CONTAINER ── */}
      <div style={{
        width: "100%",
        maxWidth: hasData ? "100%" : 720,
        margin: hasData ? "0 0 40px 0" : "0 auto",
        textAlign: hasData ? "left" : "center",
        transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {!hasData && (
          <div style={{ marginBottom: 40, animation: "fadeIn 0.6s ease" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "var(--teal)", textTransform: "uppercase", letterSpacing: 2 }}>BuyWise Intelligence</span>
              <Sparkles size={16} className="text-teal" />
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 950, letterSpacing: -2, color: "var(--text)" }}>What product are you researching?</h1>
            <p style={{ fontSize: 16, color: "var(--muted)", marginTop: 10, fontWeight: 600 }}>Get instant AI recommendations, regret analysis, and price forecasts.</p>
          </div>
        )}

        <div className="glass noise" style={{ 
          padding: 20, 
          borderRadius: 28, 
          border: "1.5px solid var(--border)",
          boxShadow: "rgba(0, 0, 0, 0.02) 0px 10px 40px"
        }}>
          <form onSubmit={onSubmit} style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={20} style={{ position: "absolute", left: 20, color: "var(--hint)" }} />
              <input 
                className="input" 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder='Search brand, product name, or paste link...' 
                style={{ 
                  paddingLeft: 54, 
                  height: 52, 
                  borderRadius: 18, 
                  fontSize: 16,
                  background: "var(--bg)",
                  border: "1.5px solid var(--border)"
                }} 
                disabled={loading} 
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary" 
              style={{ 
                whiteSpace: "nowrap", 
                borderRadius: 18, 
                padding: "0 28px",
                height: 52,
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer"
              }} 
              disabled={loading || !query.trim()}
            >
              {loading ? "Analyzing..." : "Search Product"}
            </button>
          </form>
        </div>

        {/* Suggestion tags displayed only on landing state */}
        {!hasData && !loading && (
          <div style={{ marginTop: 32, animation: "fadeIn 0.8s ease" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--hint)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Popular Searches</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {SUGGESTIONS.map((s) => (
                <div 
                  key={s.name}
                  onClick={() => handleSuggestionClick(s.name)}
                  className="glass floating-card-anim"
                  style={{
                    padding: "16px 20px",
                    borderRadius: 20,
                    border: "1.5px solid var(--border)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    textAlign: "left",
                    transition: "var(--transition-spring)",
                    background: "var(--surface)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <span style={{ fontSize: 24 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: "var(--red-dim)", border: "1.5px solid var(--red)", borderRadius: 20, padding: "16px 20px", marginBottom: 20, color: "var(--red)", fontSize: 15, fontWeight: 700, maxWidth: 720, margin: "0 auto 20px auto", textAlign: "center" }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── LOADER STATUS WALKTHROUGH ── */}
      {loading && (
        <div style={{ maxWidth: 500, margin: "40px auto", textAlign: "center", animation: "fadeIn 0.4s ease" }}>
          <div className="glass noise" style={{ padding: 40, borderRadius: 28, border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", gap: 24, alignItems: "center" }}>
            {/* Spinning loader */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              border: "4px solid var(--border)",
              borderTopColor: "var(--teal)",
              animation: "spin 1.2s linear infinite"
            }} />
            <style>{`
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>

            <div>
              <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Compiling Purchase Intelligence</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", fontWeight: 600 }}>This takes a few seconds as we aggregate reviews and run models.</p>
            </div>

            {/* Stepped Status Walkthrough */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12, borderTop: "1.5px solid var(--border)", paddingTop: 20, textAlign: "left" }}>
              {[
                { label: "Aggregating community review feeds...", step: 0 },
                { label: "Running sentiment analysis & scores...", step: 1 },
                { label: "Predicting price trend thresholds...", step: 2 },
                { label: "Generating executive AI recommendation...", step: 3 }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: 10, alignItems: "center", opacity: loadStep >= item.step ? 1 : 0.35, transition: "opacity 0.4s ease" }}>
                  <span style={{ 
                    width: 8, height: 8, borderRadius: "50%", 
                    background: loadStep > item.step ? "var(--teal)" : loadStep === item.step ? "var(--accent)" : "var(--muted)" 
                  }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: loadStep === item.step ? "var(--text)" : "var(--muted)" }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {hasData && <DashboardWidgets data={data} />}
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 24 }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="glass" style={{ height: 160, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }} />
        ))}
      </div>
    }>
      <AnalysisPageContent />
    </Suspense>
  );
}
