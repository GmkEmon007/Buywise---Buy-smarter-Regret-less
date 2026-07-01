"use client";

import { useAuth } from "@/context/auth-context";
import { AppShell } from "@/components/app-shell";
import { useState } from "react";
import { CardTilt } from "@/components/ui/card-tilt";
import { motion } from "framer-motion";
import { Clock, TrendingUp, BarChart3, Star, ArrowUpRight } from "lucide-react";

function VerdictBadge({ verdict }: { verdict: "buy" | "skip" | "wait" }) {
  const cfg = {
    buy:  { label: "✓ Buy",   cls: "badge-teal" },
    skip: { label: "✕ Skip",  cls: "badge-red" },
    wait: { label: "⏸ Wait",  cls: "badge-amber" },
  };
  const c = cfg[verdict];
  return <span className={`badge ${c.cls}`}>{c.label}</span>;
}

function ScorePill({ score, color }: { score: number; color: string }) {
  return (
    <span style={{ fontWeight: 800, fontSize: 13, color, background: `${color}18`, padding: "3px 10px", borderRadius: 100, border: `1px solid ${color}30` }}>
      {score}
    </span>
  );
}

export default function UserPage() {
  const { user, history } = useAuth();
  const [filter, setFilter] = useState<"all" | "buy" | "skip" | "wait">("all");

  if (!user) return null;

  const filtered = filter === "all" ? history : history.filter(h => h.verdict === filter);
  const buys  = history.filter(h => h.verdict === "buy").length;
  const skips = history.filter(h => h.verdict === "skip").length;
  const waits = history.filter(h => h.verdict === "wait").length;
  const avgBuy = Math.round(history.reduce((a, h) => a + h.buyScore, 0) / history.length);

  return (
    <AppShell>
      <style>{`
        .filter-btn { background: var(--surface); border: 1px solid var(--border); color: var(--muted); border-radius: var(--radius-md); padding: 6px 14px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .filter-btn.active-all    { border-color: rgba(255,255,255,0.3); color: var(--text); }
        .filter-btn.active-buy    { border-color: rgba(0,229,176,0.4);  color: var(--teal);  background: var(--teal-dim); }
        .filter-btn.active-skip   { border-color: rgba(239,68,68,0.4);  color: var(--red);   background: var(--red-dim); }
        .filter-btn.active-wait   { border-color: rgba(245,158,11,0.4); color: var(--amber); background: var(--amber-dim); }
        .filter-btn:hover { color: var(--text); }
        .history-row { transition: background 0.15s; cursor: default; }
        .history-row:hover td { background: var(--teal-dim); }
      `}</style>

      <div className="topbar mb-8">
        <div>
          <div className="page-eyebrow text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-2">My account</div>
          <h1 className="page-title text-3xl font-black tracking-tight">Purchase history</h1>
        </div>
        <div className="user-chip bg-[var(--surface-sec)] border border-[var(--border)] p-2.5 px-4 rounded-2xl flex items-center gap-3">
          <div className="avatar w-9 h-9 rounded-xl bg-lime-500/10 border border-lime-500/20 text-[var(--accent)] flex items-center justify-center font-bold text-sm">
            {user.avatar || (user.name ? user.name[0] : "U")}
          </div>
          <div>
            <div className="text-sm font-bold text-[var(--text)]">{user.name}</div>
            <div className="text-[10px] text-[var(--muted)]">Member since {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { val: history.length, label: "Total analyzed", color: "var(--text)" },
          { val: buys,           label: "Confident buys",  color: "var(--teal)" },
          { val: skips,          label: "Skipped",          color: "var(--red)" },
          { val: avgBuy || 0,    label: "Avg buy score",    color: "var(--blue)" },
        ].map((s, i) => (
          <CardTilt key={s.label} style={{ background: "var(--surface)", border: "1.5px solid var(--border)", borderRadius: 20 }}>
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="p-5"
            >
              <div className="text-3xl font-black" style={{ color: s.color }}>{s.val}</div>
              <div className="text-xs text-[var(--muted)] font-medium mt-1 uppercase tracking-wider">{s.label}</div>
            </motion.div>
          </CardTilt>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all","buy","skip","wait"] as const).map(f => (
          <button key={f} className={`filter-btn ${filter === f ? `active-${f}` : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? `All (${history.length})` : f === "buy" ? `✓ Buy (${buys})` : f === "skip" ? `✕ Skip (${skips})` : `⏸ Wait (${waits})`}
          </button>
        ))}
      </div>

      {/* History table */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[24px] shadow-[var(--shadow-soft)] overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th className="text-[var(--muted)] font-bold text-xs uppercase tracking-wider">Product</th>
              <th className="text-[var(--muted)] font-bold text-xs uppercase tracking-wider">Date</th>
              <th className="text-[var(--muted)] font-bold text-xs uppercase tracking-wider">Buy score</th>
              <th className="text-[var(--muted)] font-bold text-xs uppercase tracking-wider">Regret risk</th>
              <th className="text-[var(--muted)] font-bold text-xs uppercase tracking-wider">Trust</th>
              <th className="text-[var(--muted)] font-bold text-xs uppercase tracking-wider">Price</th>
              <th className="text-[var(--muted)] font-bold text-xs uppercase tracking-wider">Verdict</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item.id} className="history-row border-b border-[var(--border-sec)] last:border-0">
                <td className="font-bold text-sm text-[var(--text)]">{item.product}</td>
                <td className="text-xs text-[var(--muted)]">{new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                <td><ScorePill score={item.buyScore} color="var(--teal)" /></td>
                <td><ScorePill score={item.regretScore} color="var(--red)" /></td>
                <td><ScorePill score={item.trustScore} color="var(--blue)" /></td>
                <td className="font-extrabold text-sm">${item.price.toFixed(2)}</td>
                <td><VerdictBadge verdict={item.verdict} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-[var(--muted)]">
            <div className="text-4xl mb-4">◎</div>
            <div className="font-bold">No {filter} results yet</div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
