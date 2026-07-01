"use client";

import { FormEvent, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DashboardWidgets } from "@/components/dashboard-widgets";
import { AnalysisResponse, analyzeProduct } from "@/lib/api";
import { BarChart2, Search } from "lucide-react";

function AnalysisPageContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q");

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Trigger analysis when URL search parameter changes
  useEffect(() => {
    if (queryParam) {
      setQuery(queryParam);
      triggerAnalysis(queryParam);
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
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    triggerAnalysis(query.trim());
  }

  return (
    <>
      <div className="topbar">
        <div>
          <div className="page-eyebrow">Product Analysis</div>
          <h1 className="page-title">Analyze any product</h1>
        </div>
      </div>

      <div className="glass noise" style={{ padding: 18, borderRadius: "var(--radius-lg)", marginBottom: 28, border: "1.5px solid var(--border)" }}>
        <form onSubmit={onSubmit} style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={18} style={{ position: "absolute", left: 16, color: "var(--hint)" }} />
            <input 
              className="input" 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              placeholder='Try "Sony WH-1000XM5" or paste a product link...' 
              style={{ paddingLeft: 46 }} 
              disabled={loading} 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ whiteSpace: "nowrap", borderRadius: "var(--radius-md)" }} disabled={loading || !query.trim()}>
            {loading ? "Scans Running…" : "Analyze"}
          </button>
        </form>
      </div>

      {error && (
        <div style={{ background: "var(--red-dim)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 16, padding: "14px 18px", marginBottom: 20, color: "var(--red)", fontSize: 14 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 24 }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="glass" style={{ height: 160, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", animation: "skeletonPulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.15}s` }} />
          ))}
          <style>{`
            @keyframes skeletonPulse {
              0%, 100% { opacity: 0.35; transform: scale(0.99); }
              50% { opacity: 0.75; transform: scale(1); }
            }
          `}</style>
        </div>
      )}

      {data && !loading && <DashboardWidgets data={data} />}

      {!data && !loading && !error && (
        <div style={{ border: "2.5px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: "80px 24px", textAlign: "center", background: "var(--bg2)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--teal-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", margin: "0 auto 20px" }}>
            <BarChart2 size={28} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Ready to scan markets</div>
          <div style={{ fontSize: 14, color: "var(--muted)", maxWidth: 380, margin: "0 auto" }}>
            Enter a product brand, category, or store product URL above to compile active purchase intelligence reports.
          </div>
        </div>
      )}
    </>
  );
}

export default function AnalysisPage() {
  return (
    <AppShell>
      <Suspense fallback={
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, marginTop: 24 }}>
          {[0, 1, 2].map(i => (
            <div key={i} className="glass" style={{ height: 160, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }} />
          ))}
        </div>
      }>
        <AnalysisPageContent />
      </Suspense>
    </AppShell>
  );
}
