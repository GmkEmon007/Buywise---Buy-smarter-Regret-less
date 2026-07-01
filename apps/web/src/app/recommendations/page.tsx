import { AppShell } from "@/components/app-shell";

const PICKS = [
  { name:"Kindle Paperwhite",       score:91, price:139.99, cat:"E-readers",   tags:["Low regret","Long-term value"], reason:"High satisfaction scores, durable ownership, low recurring complaints across 60k+ reviews." },
  { name:"Anker 737 Power Bank",    score:88, price:99.99,  cat:"Accessories", tags:["Reliable","Great warranty"],    reason:"Strong reliability signals and better warranty confidence than generic alternatives." },
  { name:"Logitech MX Master 3S",   score:86, price:79.99,  cat:"Peripherals", tags:["Ergonomic","Productivity"],    reason:"Excellent fit for users prioritizing long-session comfort and multi-device switching." },
];

export default function RecsPage() {
  return (
    <AppShell>
      <div className="topbar"><div><div className="page-eyebrow">Personalized picks</div><h1 className="page-title">Better picks for your style</h1></div></div>
      <div className="recommendation-grid">
        {PICKS.map((p,i) => (
          <div key={p.name} className="glass noise interactive-card" style={{ padding: 24, borderRadius: 16, cursor: "default", animationDelay: `${i*0.08}s` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{p.cat}</span>
              <span style={{ fontWeight: 900, fontSize: 18, color: "var(--teal)", background: "var(--teal-dim)", padding: "3px 10px", borderRadius: 8, border: "1px solid rgba(0,229,176,0.2)" }}>{p.score}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 14 }}>{p.reason}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {p.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>◎ {t}</span>)}
            </div>
            <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)", fontWeight: 800, fontSize: 16 }}>${p.price}</div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
