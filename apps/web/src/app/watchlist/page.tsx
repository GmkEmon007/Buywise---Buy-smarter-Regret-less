"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { 
  Star, TrendingDown, TrendingUp, Bell, 
  Trash2, AlertCircle, Percent, ArrowUpRight
} from "lucide-react";
import Link from "next/link";

type WatchItem = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  trend: "down" | "up" | "stable";
  dropChance: number;
  prediction: string;
  notify: boolean;
};

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchItem[]>([
    {
      id: "w1",
      name: "MacBook Air M4",
      price: 1099.00,
      oldPrice: 1199.00,
      trend: "stable",
      dropChance: 15,
      prediction: "Prices expected to remain stable for 30 days.",
      notify: true
    },
    {
      id: "w2",
      name: "Sony WH-1000XM5",
      price: 279.99,
      oldPrice: 349.99,
      trend: "down",
      dropChance: 82,
      prediction: "Strong drop predicted in next 7 days.",
      notify: true
    },
    {
      id: "w3",
      name: "RTX 5070",
      price: 599.99,
      oldPrice: 599.99,
      trend: "down",
      dropChance: 90,
      prediction: "Price expected to drop upon announcement next week.",
      notify: false
    }
  ]);

  const toggleNotify = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, notify: !item.notify } : item));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Header */}
        <div className="topbar">
          <div>
            <div className="page-eyebrow">Price Monitoring</div>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Star size={34} className="text-teal" /> Your Watchlist
            </h1>
          </div>
          <Link href="/price-alerts" className="btn-ghost btn-sm">
            View Price Alerts Timeline
          </Link>
        </div>

        {/* Watchlist Grid */}
        <div className="trends-grid" style={{ marginBottom: 40 }}>
          {items.map(item => {
            const savings = item.oldPrice > item.price ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100) : 0;
            return (
              <div key={item.id} className="glass noise interactive-card" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", position: "relative" }}>
                
                {/* Trash icon top right */}
                <button 
                  onClick={() => removeItem(item.id)}
                  style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "var(--hint)", cursor: "pointer", transition: "all 0.15s" }}
                  title="Remove from watchlist"
                >
                  <Trash2 size={16} />
                </button>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 18, color: "var(--text)", paddingRight: 24, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {item.name}
                    </div>
                    {savings > 0 && (
                      <span className="badge badge-teal" style={{ marginTop: 6 }}>
                        <Percent size={11} /> {savings}% Drop Saved
                      </span>
                    )}
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>CURRENT PRICE</div>
                      <div style={{ fontSize: 22, fontWeight: 900 }}>${item.price}</div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>PRICE TREND</div>
                      <div style={{ display: "flex", gap: 5, alignItems: "center", justifyContent: "flex-end", fontWeight: 700, fontSize: 14, color: item.trend === "down" ? "var(--teal)" : item.trend === "up" ? "var(--red)" : "var(--muted)" }}>
                        {item.trend === "down" ? (
                          <>
                            <TrendingDown size={14} /> Downward
                          </>
                        ) : item.trend === "up" ? (
                          <>
                            <TrendingUp size={14} /> Upward
                          </>
                        ) : (
                          "Stable"
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: "var(--hint)", fontWeight: 700, textTransform: "uppercase", marginBottom: 6 }}>AI Prediction</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                      <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 2 }} className={item.dropChance > 50 ? "text-teal" : "text-hint"} />
                      <span>{item.prediction}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)", padding: "10px 14px", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>Chance of Drop: {item.dropChance}%</span>
                    <button 
                      onClick={() => toggleNotify(item.id)}
                      className="btn-ghost" 
                      style={{ 
                        width: 32, height: 32, padding: 0, borderRadius: "50%", 
                        background: item.notify ? "var(--teal-dim)" : "var(--surface)",
                        borderColor: item.notify ? "var(--teal)" : "var(--border)",
                        color: item.notify ? "var(--teal)" : "var(--muted)"
                      }}
                      title={item.notify ? "Mute alerts" : "Unmute alerts"}
                    >
                      <Bell size={14} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: "64px 24px", textAlign: "center", background: "var(--bg2)" }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>☆</div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>No items in Watchlist</div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Add items during product analysis to monitor price feeds.</p>
          </div>
        )}

      </div>
    </AppShell>
  );
}
