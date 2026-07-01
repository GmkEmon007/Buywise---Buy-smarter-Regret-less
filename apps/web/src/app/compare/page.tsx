"use client";

import { useState, useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, ResponsiveContainer, Legend
} from "recharts";
import { 
  ArrowLeftRight, Sparkles, CheckCircle2, AlertTriangle, 
  HelpCircle, BarChart3, ShieldAlert
} from "lucide-react";

type ProductDetails = {
  name: string;
  specs: Record<string, string | number>;
  scores: {
    Performance: number;
    Battery: number;
    Display: number;
    Gaming: number;
    Community: number;
    PriceValue: number;
  };
  verdict: string;
  isWinner: boolean;
};

const PRODUCTS: Record<string, ProductDetails> = {
  "MacBook Air M4": {
    name: "MacBook Air M4",
    specs: {
      CPU: "Apple M4 (10-Core)",
      Battery: "Up to 20 hours",
      Weight: "2.7 lbs",
      OS: "macOS Sequoia",
      Display: "Liquid Retina (13.6-inch)",
      Price: "$1,099"
    },
    scores: {
      Performance: 92,
      Battery: 98,
      Display: 88,
      Gaming: 55,
      Community: 95,
      PriceValue: 90
    },
    verdict: "Best overall for coding, productivity, and long battery life. Extremely low regret score.",
    isWinner: true
  },
  "Dell XPS 13": {
    name: "Dell XPS 13",
    specs: {
      CPU: "Intel Core Ultra 7",
      Battery: "Up to 12 hours",
      Weight: "2.6 lbs",
      OS: "Windows 11 Home",
      Display: "OLED InfinityEdge (13.4-inch)",
      Price: "$1,299"
    },
    scores: {
      Performance: 85,
      Battery: 70,
      Display: 95,
      Gaming: 65,
      Community: 80,
      PriceValue: 75
    },
    verdict: "Excellent choice if you require Windows, OLED displays, and slim borders, but suffers from throttle and thermal concerns under load.",
    isWinner: false
  },
  "Sony WH-1000XM5": {
    name: "Sony WH-1000XM5",
    specs: {
      CPU: "MediaTek V1 Processor",
      Battery: "Up to 30 hours",
      Weight: "0.55 lbs",
      OS: "Sony Firmware",
      Display: "Over-Ear Dynamic",
      Price: "$399"
    },
    scores: {
      Performance: 82,
      Battery: 95,
      Display: 88,
      Gaming: 50,
      Community: 80,
      PriceValue: 80
    },
    verdict: "Excellent active noise cancellation and soundstage. Recommended for traveling, offices, and long sessions.",
    isWinner: true
  },
  "RTX 5070": {
    name: "RTX 5070",
    specs: {
      CPU: "NVIDIA Blackwell GPU",
      Battery: "N/A (Desktop)",
      Weight: "3.2 lbs",
      OS: "GeForce Driver",
      Display: "DirectX 12 Ultimate",
      Price: "$599"
    },
    scores: {
      Performance: 95,
      Battery: 10,
      Display: 90,
      Gaming: 98,
      Community: 88,
      PriceValue: 82
    },
    verdict: "Top-tier rendering performance and gaming frame rates. Be sure to check desktop power supply parameters.",
    isWinner: true
  },
  "iPhone 17": {
    name: "iPhone 17",
    specs: {
      CPU: "Apple A19 Pro",
      Battery: "Up to 18 hours",
      Weight: "0.42 lbs",
      OS: "iOS 19",
      Display: "Super Retina XDR",
      Price: "$999"
    },
    scores: {
      Performance: 88,
      Battery: 85,
      Display: 94,
      Gaming: 75,
      Community: 85,
      PriceValue: 76
    },
    verdict: "Extremely refined mobile platform with a high brightness display and high user satisfaction indices.",
    isWinner: true
  }
};

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const [p1, setP1] = useState("MacBook Air M4");
  const [p2, setP2] = useState("Dell XPS 13");

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const paramP1 = params.get("p1");
    const paramP2 = params.get("p2");
    if (paramP1 && PRODUCTS[paramP1]) setP1(paramP1);
    if (paramP2 && PRODUCTS[paramP2]) setP2(paramP2);
  }, []);

  const prod1 = PRODUCTS[p1] || PRODUCTS["MacBook Air M4"];
  const prod2 = PRODUCTS[p2] || PRODUCTS["Dell XPS 13"];

  const radarData = [
    { subject: "Performance", A: prod1.scores.Performance, B: prod2.scores.Performance },
    { subject: "Battery", A: prod1.scores.Battery, B: prod2.scores.Battery },
    { subject: "Display", A: prod1.scores.Display, B: prod2.scores.Display },
    { subject: "Gaming", A: prod1.scores.Gaming, B: prod2.scores.Gaming },
    { subject: "Community", A: prod1.scores.Community, B: prod2.scores.Community },
    { subject: "Price Value", A: prod1.scores.PriceValue, B: prod2.scores.PriceValue }
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="page-eyebrow">Product Comparison</div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <ArrowLeftRight size={34} className="text-teal" /> Compare Products
          </h1>
        </div>

        {/* Split Dropdowns Selection */}
        <div className="compare-selectors" style={{ gap: 20, alignItems: "center", marginBottom: 36 }}>
          <div>
            <select 
              value={p1} 
              onChange={e => setP1(e.target.value)} 
              className="input"
              style={{ fontWeight: 800, cursor: "pointer", borderRadius: 16 }}
            >
              {Object.keys(PRODUCTS).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: 16, fontWeight: 900, color: "var(--hint)" }}>VS</div>
          
          <div>
            <select 
              value={p2} 
              onChange={e => setP2(e.target.value)} 
              className="input"
              style={{ fontWeight: 800, cursor: "pointer", borderRadius: 16 }}
            >
              {Object.keys(PRODUCTS).map(k => (
                <option key={k} value={k}>{k}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Compare Content Split Grid */}
        <div className="insights-grid" style={{ marginBottom: 40 }}>
          
          {/* Radar Chart Grid */}
          <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--hint)", letterSpacing: "1px", marginBottom: 20 }}>Trait Comparison</div>
            <div style={{ height: 280, display: "flex", justifyContent: "center" }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted)", fontSize: 11, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "var(--hint)", fontSize: 9 }} />
                    <Radar name={prod1.name} dataKey="A" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.25} />
                    <Radar name={prod2.name} dataKey="B" stroke="var(--blue)" fill="var(--blue)" fillOpacity={0.25} />
                    <Legend wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* AI Verdict & Winner Section */}
          <div className="glass" style={{ padding: 24, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--hint)", letterSpacing: "1px" }}>AI Verdict</span>
                <span className="badge badge-teal" style={{ padding: "5px 12px", fontSize: 11 }}>
                  <Sparkles size={12} /> Winner Calculated
                </span>
              </div>
              
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 32 }}>🏆</div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>Winner: {prod1.isWinner ? prod1.name : prod2.name}</div>
                  <div style={{ fontSize: 12, color: "var(--teal)", fontWeight: 700 }}>94 Buy Score Consensus</div>
                </div>
              </div>

              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 18 }}>
                {prod1.isWinner ? prod1.verdict : prod2.verdict}
              </p>
            </div>
            
            <div style={{ background: "var(--bg2)", padding: 14, borderRadius: 16, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <AlertTriangle size={16} className="text-amber" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                  Notice: Thermal throttle concerns exist in the {prod2.name} under heavy workloads according to 400+ community complaints.
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Breakdown Spec Table */}
        <div className="glass" style={{ borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", overflow: "hidden", marginBottom: 40 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)", fontWeight: 800, fontSize: 16 }}>
            Technical specifications comparison
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Feature</th>
                <th style={{ width: "35%" }}>{prod1.name}</th>
                <th style={{ width: "35%" }}>{prod2.name}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(prod1.specs).map(specKey => (
                <tr key={specKey}>
                  <td style={{ fontWeight: 700, color: "var(--muted)" }}>{specKey}</td>
                  <td style={{ fontWeight: p1 === "MacBook Air M4" && specKey === "Battery" ? 800 : 500, color: p1 === "MacBook Air M4" && specKey === "Battery" ? "var(--teal)" : "var(--text)" }}>
                    {prod1.specs[specKey]}
                  </td>
                  <td style={{ fontWeight: p2 === "MacBook Air M4" && specKey === "Battery" ? 800 : 500, color: p2 === "MacBook Air M4" && specKey === "Battery" ? "var(--teal)" : "var(--text)" }}>
                    {prod2.specs[specKey]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </AppShell>
  );
}
