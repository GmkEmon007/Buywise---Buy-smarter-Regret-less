"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { 
  Send, Sparkles, AlertCircle, TrendingDown, 
  CheckCircle2, ArrowRight, MessageSquare, ShieldCheck
} from "lucide-react";
import Link from "next/link";

type Message = {
  sender: "user" | "ai";
  text: string;
  citations?: string[];
  productCard?: {
    name: string;
    score: number;
    price: number;
    verdict: string;
  };
  hasPriceChart?: boolean;
};

const SUGGESTIONS = [
  "Should I wait for the RTX 5070?",
  "Is the MacBook Air M4 worth it for programming?",
  "Bose QuietComfort Ultra vs Sony XM5 headphones?"
];

export default function ChatPage() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am your BuyWise AI assistant. Ask me anything about products, comparison details, price forecasts, or regret scores to make a smarter purchase decision."
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = { sender: "user", text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setQuery("");
    setLoading(true);

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 1200));

    let aiMsg: Message = {
      sender: "ai",
      text: "Based on our compiled review sentiment feeds, this is a solid choice. Let me outline the primary data parameters for your query."
    };

    const lowercaseText = textToSend.toLowerCase();

    if (lowercaseText.includes("rtx") || lowercaseText.includes("5070")) {
      aiMsg = {
        sender: "ai",
        text: "According to manufacturing timeline signals and leaks, NVIDIA is expected to announce the RTX 5070 next quarter. Current review signals suggest waiting, as RTX 4070 prices are projected to decline by 12-15% immediately upon launch.",
        citations: ["r/nvidia", "GamersNexus Transcripts", "HardwareUnboxed Price Index"],
        productCard: {
          name: "RTX 5070 (Predicted)",
          score: 88,
          price: 599.99,
          verdict: "Wait for Announcement"
        },
        hasPriceChart: true
      };
    } else if (lowercaseText.includes("macbook") || lowercaseText.includes("m4")) {
      aiMsg = {
        sender: "ai",
        text: "The MacBook Air M4 scores exceptionally high for developer workloads. Review consensus highlights the 16GB unified memory standard as a huge upgrade. Regret risk is extremely low (under 5%), mostly centered around lack of multiple external displays support.",
        citations: ["r/macbookair", "Dave2D Reviews", "Apple Insider Benchmarks"],
        productCard: {
          name: "MacBook Air M4 (16GB RAM)",
          score: 94,
          price: 1099.00,
          verdict: "Strong Buy"
        }
      };
    } else if (lowercaseText.includes("bose") || lowercaseText.includes("xm5")) {
      aiMsg = {
        sender: "ai",
        text: "Comparing the Bose QC Ultra and Sony WH-1000XM5: The Bose leads in active noise cancellation depth and foldability, while the Sony offers slightly cleaner microphone parameters and better value. Most reviewers recommend Bose for travel comfort and Sony for workspaces.",
        citations: ["r/headphones", "RTINGS Benchmark Index", "SoundGuys Transcripts"],
        productCard: {
          name: "Sony WH-1000XM5",
          score: 80,
          price: 279.99,
          verdict: "Buy on Discount"
        }
      };
    }

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div className="page-eyebrow">AI shopping assistant</div>
          <h1 className="page-title" style={{ fontSize: 40, letterSpacing: -1 }}>Ask BuyWise</h1>
        </div>

        {/* Message Feed Area */}
        <div style={{ 
          flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", 
          gap: 20, paddingRight: 10, paddingBottom: 20, scrollbarWidth: "thin" 
        }}>
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                display: "flex",
                flexDirection: "column",
                gap: 12
              }}
            >
              {/* Message content bubble */}
              <div className="glass" style={{
                padding: "20px 24px",
                borderRadius: "var(--radius-lg)",
                border: msg.sender === "user" ? "1.5px solid var(--teal)" : "1.5px solid var(--border)",
                background: msg.sender === "user" ? "var(--teal-dim)" : "var(--surface)",
                fontSize: 15,
                lineHeight: 1.6
              }}>
                <div style={{ fontWeight: 800, fontSize: 12, textTransform: "uppercase", color: "var(--teal)", marginBottom: 6 }}>
                  {msg.sender === "user" ? "You" : "BuyWise AI"}
                </div>
                <div>{msg.text}</div>
              </div>

              {/* Citations / Sources */}
              {msg.citations && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingLeft: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--hint)", alignSelf: "center" }}>SOURCES:</span>
                  {msg.citations.map((c, i) => (
                    <span key={i} className="tag" style={{ fontSize: 11, borderRadius: 6 }}>
                      [{i + 1}] {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Inline Product Recommendation Card */}
              {msg.productCard && (
                <div className="glass noise floating-card-anim" style={{ 
                  padding: 20, borderRadius: 20, border: "1.5px solid var(--border)", 
                  width: 320, alignSelf: "flex-start", display: "flex", gap: 14 
                }}>
                  <div style={{ fontSize: 32 }}>🛍</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{msg.productCard.name}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--teal)", marginTop: 2 }}>{msg.productCard.score} Buy Score</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                      <span style={{ fontWeight: 800 }}>${msg.productCard.price}</span>
                      <Link href={`/analysis?q=${encodeURIComponent(msg.productCard.name)}`} className="btn-ghost btn-sm" style={{ padding: "0 10px", height: 28, borderRadius: 6, fontSize: 11 }}>
                        View Scans
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Inline forecast widget */}
              {msg.hasPriceChart && (
                <div className="glass" style={{ padding: 16, borderRadius: 16, width: 320, alignSelf: "flex-start", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 8, fontWeight: 700 }}>
                    <span style={{ color: "var(--hint)" }}>PRICE OUTLOOK</span>
                    <span style={{ color: "var(--red)" }}>↓ Drop expected</span>
                  </div>
                  <div style={{ height: 60, display: "flex", alignItems: "flex-end", gap: 8, padding: "0 10px" }}>
                    {[20, 24, 22, 18, 14, 12].map((h, i) => (
                      <div key={i} style={{ flex: 1, background: i === 5 ? "var(--teal)" : "var(--border2)", height: `${h * 2}px`, borderRadius: 4 }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--hint)", marginTop: 6 }}>
                    <span>Current</span>
                    <span>Next Week</span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ alignSelf: "flex-start", display: "flex", gap: 8, alignItems: "center", padding: "14px 20px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", animation: "dotPulse 1.2s infinite ease-in-out" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", animation: "dotPulse 1.2s infinite ease-in-out", animationDelay: "0.2s" }} />
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--teal)", animation: "dotPulse 1.2s infinite ease-in-out", animationDelay: "0.4s" }} />
              <style>{`
                @keyframes dotPulse { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
              `}</style>
            </div>
          )}
        </div>

        {/* Suggestion tags */}
        {messages.length === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--hint)", textTransform: "uppercase" }}>Suggested Queries:</span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {SUGGESTIONS.map((s) => (
                <button 
                  key={s} 
                  onClick={() => handleSend(s)}
                  className="tag" 
                  style={{ cursor: "pointer", transition: "var(--transition-spring)", padding: "8px 14px", borderRadius: 100, border: "1.5px solid var(--border)", background: "var(--surface)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input prompt area */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(query); }}
          style={{ 
            display: "flex", gap: 10, background: "var(--surface)", 
            padding: 8, borderRadius: 100, border: "1.5px solid var(--border)",
            boxShadow: "var(--shadow-soft)", marginBottom: 30, alignItems: "center"
          }}
        >
          <input 
            className="input"
            type="text" 
            placeholder="Ask BuyWise anything..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ border: "none", background: "transparent", flex: 1, paddingLeft: 20, height: 42 }}
            disabled={loading}
          />
          <button type="submit" className="btn-primary" style={{ borderRadius: "50%", width: 44, height: 44, padding: 0 }} disabled={loading || !query.trim()}>
            <Send size={16} />
          </button>
        </form>

      </div>
    </AppShell>
  );
}
