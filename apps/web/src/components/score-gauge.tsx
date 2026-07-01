"use client";

type Tone = "good" | "risk" | "trust";

const COLORS: Record<Tone, string> = {
  good:  "var(--teal)",
  risk:  "var(--red)",
  trust: "var(--blue)",
};

const SUBLABELS: Record<Tone, string> = {
  good:  "Strong buy",
  risk:  "Low risk",
  trust: "High trust",
};

export function ScoreGauge({ label, score, tone = "good" }: { label: string; score: number; tone?: Tone }) {
  const color = COLORS[tone];
  const r = 38;
  const circ = 2 * Math.PI * r;
  const filled = circ - (score / 100) * circ;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ position: "relative", width: 96, height: 96, flexShrink: 0 }}>
        <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: 96, height: 96 }}>
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
          <circle cx="50" cy="50" r={r} fill="none" stroke={color}
            strokeWidth="9" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={filled}
            style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.2s" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22, color }}>
          {score}
        </div>
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: -1, color: "var(--text)", lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color, marginTop: 4 }}>{SUBLABELS[tone]}</div>
      </div>
    </div>
  );
}
