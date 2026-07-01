"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { 
  Clock, Search, Filter, Trash2, ArrowUpRight, 
  ArrowRight, ShieldCheck
} from "lucide-react";
import Link from "next/link";

type HistoryGroup = {
  timeframe: string;
  items: {
    id: string;
    product: string;
    score: number;
    price: number;
    verdict: "buy" | "skip" | "wait";
  }[];
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState<"all" | "buy" | "skip" | "wait">("all");

  const [historyGroups, setHistoryGroups] = useState<HistoryGroup[]>([
    {
      timeframe: "Today",
      items: [
        { id: "h1", product: "MacBook Air M4", score: 94, price: 1099.00, verdict: "buy" }
      ]
    },
    {
      timeframe: "Yesterday",
      items: [
        { id: "h2", product: "Sony WH-1000XM5", score: 80, price: 279.99, verdict: "buy" },
        { id: "h3", product: "iPad Pro 13-inch", score: 76, price: 999.00, verdict: "wait" }
      ]
    },
    {
      timeframe: "June",
      items: [
        { id: "h4", product: "RTX 5070", score: 88, price: 599.99, verdict: "wait" },
        { id: "h5", product: "Razer DeathAdder V3", score: 58, price: 89.99, verdict: "skip" },
        { id: "h6", product: "LG C3 OLED 55\"", score: 91, price: 1199.00, verdict: "buy" }
      ]
    }
  ]);

  const deleteItem = (groupIdx: number, itemId: string) => {
    setHistoryGroups(prev => {
      return prev.map((group, idx) => {
        if (idx === groupIdx) {
          return {
            ...group,
            items: group.items.filter(item => item.id !== itemId)
          };
        }
        return group;
      }).filter(group => group.items.length > 0);
    });
  };

  const getVerdictStyle = (verdict: "buy" | "skip" | "wait") => {
    switch (verdict) {
      case "buy": return "badge-teal";
      case "skip": return "badge-red";
      case "wait": return "badge-amber";
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="page-eyebrow">Search Records</div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={34} className="text-teal" /> Analysis History
          </h1>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 260, position: "relative", display: "flex", alignItems: "center" }}>
            <Search size={18} style={{ position: "absolute", left: 14, color: "var(--hint)" }} />
            <input 
              className="input" 
              placeholder="Search history..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {(["all", "buy", "skip", "wait"] as const).map(filter => (
              <button 
                key={filter}
                onClick={() => setVerdictFilter(filter)}
                className={`btn-ghost btn-sm`}
                style={{ 
                  borderRadius: 100, 
                  background: verdictFilter === filter ? "var(--teal-dim)" : "var(--surface)",
                  borderColor: verdictFilter === filter ? "var(--teal)" : "var(--border)",
                  color: verdictFilter === filter ? "var(--teal)" : "var(--text)"
                }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Timeframe Grouped History Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          {historyGroups.map((group, groupIdx) => {
            // Filter group items
            const filteredItems = group.items.filter(item => {
              const matchesSearch = item.product.toLowerCase().includes(search.toLowerCase());
              const matchesVerdict = verdictFilter === "all" || item.verdict === verdictFilter;
              return matchesSearch && matchesVerdict;
            });

            if (filteredItems.length === 0) return null;

            return (
              <div key={group.timeframe}>
                
                {/* Timeframe Title */}
                <div style={{ 
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase", 
                  color: "var(--hint)", letterSpacing: "1px", marginBottom: 12,
                  paddingLeft: 8
                }}>
                  {group.timeframe}
                </div>

                {/* List Container */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredItems.map(item => (
                    <div 
                      key={item.id}
                      className="glass interactive-card"
                      style={{ 
                        display: "flex", justifyItems: "center", alignItems: "center", 
                        padding: "16px 20px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)",
                        justifyContent: "space-between", cursor: "default"
                      }}
                    >
                      <div style={{ display: "flex", gap: 16, alignItems: "center", flex: 1 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                          🛍
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{item.product}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginTop: 2 }}>
                            Buy Score: <span className="text-teal">{item.score}</span> · ${item.price}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                        <span className={`badge ${getVerdictStyle(item.verdict)}`}>
                          {item.verdict.toUpperCase()}
                        </span>
                        
                        <div style={{ width: 1.5, height: 16, background: "var(--border)" }} />
                        
                        <Link 
                          href={`/analysis?q=${encodeURIComponent(item.product)}`}
                          className="btn-ghost btn-sm"
                          style={{ padding: "0 10px", height: 32, borderRadius: 8, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                        >
                          Scans <ArrowRight size={12} />
                        </Link>

                        <button 
                          onClick={() => deleteItem(groupIdx, item.id)}
                          style={{ background: "none", border: "none", color: "var(--hint)", cursor: "pointer", transition: "all 0.15s" }}
                          title="Delete from history"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {historyGroups.every(g => g.items.length === 0) && (
          <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: "64px 24px", textAlign: "center", background: "var(--bg2)" }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>◷</div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>Search History Empty</div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Your product search and analysis history will appear here.</p>
          </div>
        )}

      </div>
    </AppShell>
  );
}
