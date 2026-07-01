"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { 
  Bell, ChevronRight, TrendingDown, Clock, 
  Sparkles, CheckCircle2, ArrowDownRight
} from "lucide-react";
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from "recharts";

type AlertEvent = {
  timeframe: string;
  title: string;
  product: string;
  description: string;
  priceDetail: string;
  type: "drop" | "prediction" | "alert";
};

export default function PriceAlertsPage() {
  const [mounted, setMounted] = useState(false);
  useState(() => { setMounted(true); });

  const timelineEvents: AlertEvent[] = [
    {
      timeframe: "Yesterday",
      title: "Sony WH-1000XM5 Price Drop Detected",
      product: "Sony WH-1000XM5",
      description: "Scraper captured a discount drop across 3 authorized retail sellers.",
      priceDetail: "Price fell from $349.99 to $279.99 (-20%)",
      type: "drop"
    },
    {
      timeframe: "Today",
      title: "RTX 5070 Launch Alert Setup",
      product: "RTX 5070",
      description: "BuyWise ML timeline locked announcement alert patterns.",
      priceDetail: "Alert threshold set: Notify immediately on release",
      type: "alert"
    },
    {
      timeframe: "Tomorrow",
      title: "iPhone 17 Analysis Forecast",
      product: "iPhone 17",
      description: "Predictive analyzer executes weekly bulk reviews updates.",
      priceDetail: "Expected buy score stability check",
      type: "prediction"
    },
    {
      timeframe: "Prediction (Next Week)",
      title: "MacBook Air M4 Expected Price Bottom",
      product: "MacBook Air M4",
      description: "Seasonal historical signals predict a temporary retail price reduction.",
      priceDetail: "Estimated drop: $100 off base models",
      type: "prediction"
    }
  ];

  const forecastData = [
    { day: "Mon", price: 299 },
    { day: "Tue", price: 289 },
    { day: "Wed", price: 279 },
    { day: "Thu", price: 279 },
    { day: "Fri", price: 269 },
    { day: "Sat", price: 249 },
    { day: "Sun (Prediction)", price: 239 }
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="page-eyebrow">Market Alerts</div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Bell size={34} className="text-teal" /> Price Alerts Timeline
          </h1>
        </div>

        {/* Forecast Chart Widget */}
        <div className="glass noise" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--hint)", letterSpacing: "1px" }}>Price Movement Tracker</div>
              <div style={{ fontWeight: 800, fontSize: 18, marginTop: 4 }}>Sony XM5 Forecast Horizon</div>
            </div>
            <span className="badge badge-teal"><Sparkles size={12} /> ML Outlook Stable</span>
          </div>

          <div style={{ height: 160 }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="alertGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--teal)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--teal)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} domain={[200, 310]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="price" stroke="var(--teal)" strokeWidth={2} fill="url(#alertGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Timeline List */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--hint)", letterSpacing: "1px", marginBottom: 20 }}>Event Log</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "relative" }}>
            
            {/* Center line helper */}
            <div style={{ position: "absolute", left: 16, top: 20, bottom: 20, width: 2, background: "var(--border)" }} />

            {timelineEvents.map((event, idx) => (
              <div key={idx} style={{ display: "flex", gap: 20, position: "relative" }}>
                
                {/* Timeline node */}
                <div style={{ 
                  width: 34, height: 34, borderRadius: "50%", background: "var(--surface)", 
                  border: "2px solid var(--border)", display: "flex", alignItems: "center", 
                  justifyContent: "center", color: event.type === "drop" ? "var(--teal)" : event.type === "alert" ? "var(--blue)" : "var(--amber)",
                  zIndex: 10, flexShrink: 0
                }}>
                  <Clock size={14} />
                </div>

                {/* Timeline card */}
                <div className="glass" style={{ flex: 1, padding: 20, borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--teal)" }}>{event.timeframe}</div>
                    {event.type === "drop" && <span className="badge badge-teal">-20% Savings</span>}
                  </div>
                  <h4 style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{event.title}</h4>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>{event.description}</p>
                  <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 700, display: "flex", gap: 5, alignItems: "center" }}>
                    <CheckCircle2 size={12} className="text-teal" /> {event.priceDetail}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  );
}
