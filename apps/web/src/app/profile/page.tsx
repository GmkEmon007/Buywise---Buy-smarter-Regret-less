"use client";

import { useAuth } from "@/context/auth-context";
import { AppShell } from "@/components/app-shell";
import { 
  User, Award, Sparkles, TrendingUp, ShieldCheck, 
  Heart, Bookmark, Landmark
} from "lucide-react";

export default function ProfilePage() {
  const { user, history } = useAuth();
  
  if (!user) return null;

  const stats = [
    { label: "Products Analyzed", val: history.length + 10, icon: <Bookmark size={20} />, color: "var(--blue)" },
    { label: "Money Saved ($)", val: "$240.00", icon: <Landmark size={20} />, color: "var(--teal)" },
    { label: "Bad Purchases Avoided", val: "4", icon: <ShieldCheck size={20} />, color: "var(--red)" },
    { label: "Favorite Category", val: "Audio / Tech", icon: <Heart size={20} />, color: "var(--purple)" }
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        
        {/* Header */}
        <div className="topbar">
          <div>
            <div className="page-eyebrow">User Profile</div>
            <h1 className="page-title">Your buyer profile</h1>
          </div>
          <span className="badge badge-amber" style={{ fontSize: 13, padding: "6px 14px" }}>
            <Award size={13} /> Premium Member
          </span>
        </div>

        {/* Profile Card Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, marginBottom: 40 }}>
          
          {/* User info card */}
          <div className="glass noise" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", textAlign: "center" }}>
            <div className="avatar" style={{ 
              width: 80, height: 80, background: "var(--teal-dim)", color: "var(--teal)", 
              border: "2px solid rgba(13, 148, 136, 0.3)", fontSize: 28, fontWeight: 900, 
              margin: "0 auto 16px" 
            }}>
              {user.avatar}
            </div>
            <div style={{ fontWeight: 900, fontSize: 22, color: "var(--text)" }}>{user.name}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600, marginTop: 4 }}>{user.email}</div>
            <div className="divider" style={{ margin: "20px 0" }} />
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
              Value-focused, quality-sensitive, and low-regret purchasing preference.
            </div>
          </div>

          {/* Details list card */}
          <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--hint)", letterSpacing: "1px", marginBottom: 18 }}>Buyer Priorities</div>
            <div className="priority-grid">
              {[
                "Reliability signals",
                "Long-term warranty",
                "Comfort benchmarks",
                "Price stability indices",
                "Authentic Reddit consensus",
                "Creator review summaries"
              ].map(p => (
                <div key={p} className="priority-chip" style={{ 
                  background: "var(--bg2)", border: "1.5px solid var(--border)", 
                  borderRadius: 14, padding: "14px 18px", fontSize: 14, 
                  fontWeight: 700, display: "flex", alignItems: "center", gap: 10, cursor: "default" 
                }}>
                  <span className="text-teal">◎</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* User stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s, idx) => (
            <div key={idx} className="glass noise" style={{ padding: 20, borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span className="badge badge-teal" style={{ fontSize: 9, padding: "2px 6px" }}>Calculated</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "var(--text)" }}>{s.val}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
