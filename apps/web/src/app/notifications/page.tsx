"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { 
  Bell, Trash2, TrendingDown, Percent, Sparkles, 
  ChevronRight, ArrowRight, ShieldCheck
} from "lucide-react";
import Link from "next/link";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: "drop" | "sale" | "ai";
  product: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: "RTX GPU price drop alert!",
      body: "RTX GPU prices dropped by 8% in the last 24 hours. The forecast matches our predicted bottom threshold.",
      time: "2 hours ago",
      read: false,
      type: "drop",
      product: "RTX 5070"
    },
    {
      id: "n2",
      title: "MacBook Air M4 Retail Sale",
      body: "Authorized retailers announced a flash discount. Savings of $100 are now active.",
      time: "5 hours ago",
      read: false,
      type: "sale",
      product: "MacBook Air M4"
    },
    {
      id: "n3",
      title: "New AI Recommendation Match",
      body: "We found a high-trust alternative matching your ergonomic preferences: Logitech MX Master 3S.",
      time: "Yesterday",
      read: true,
      type: "ai",
      product: "Logitech MX Master 3S"
    }
  ]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: "drop" | "sale" | "ai") => {
    switch (type) {
      case "drop": return <TrendingDown size={16} />;
      case "sale": return <Percent size={16} />;
      case "ai": return <Sparkles size={16} />;
    }
  };

  const getBadgeStyle = (type: "drop" | "sale" | "ai") => {
    switch (type) {
      case "drop": return "badge-red";
      case "sale": return "badge-teal";
      case "ai": return "badge-blue";
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* Header */}
        <div className="topbar">
          <div>
            <div className="page-eyebrow">User Alerts</div>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Bell size={34} className="text-teal" /> Notifications Center
            </h1>
          </div>
          {notifications.some(n => !n.read) && (
            <button onClick={markAllRead} className="btn-ghost btn-sm" style={{ borderRadius: 100 }}>
              Mark All as Read
            </button>
          )}
        </div>

        {/* Notifications list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {notifications.map(n => (
            <div 
              key={n.id}
              className="glass noise interactive-card"
              style={{
                padding: 20, borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)",
                display: "flex", gap: 18, position: "relative",
                background: n.read ? "var(--surface)" : "var(--bg2)"
              }}
            >
              
              {/* Blue indicator dot if unread */}
              {!n.read && (
                <div style={{ position: "absolute", top: 22, left: 10, width: 6, height: 6, borderRadius: "50%", background: "var(--blue)" }} />
              )}

              {/* Icon Container */}
              <div className={`badge ${getBadgeStyle(n.type)}`} style={{ 
                width: 36, height: 36, borderRadius: "50%", display: "flex", 
                alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 
              }}>
                {getIcon(n.type)}
              </div>

              {/* Body details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <h4 style={{ fontWeight: 800, fontSize: 16, color: "var(--text)" }}>{n.title}</h4>
                  <span style={{ fontSize: 11, color: "var(--hint)", fontWeight: 600 }}>{n.time}</span>
                </div>
                
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5, marginTop: 4, marginBottom: 14 }}>
                  {n.body}
                </p>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Link href={`/analysis?q=${encodeURIComponent(n.product)}`} className="btn-ghost btn-sm" style={{ padding: "0 10px", height: 28, borderRadius: 6, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                    View Analysis <ArrowRight size={12} />
                  </Link>
                  
                  <button 
                    onClick={() => removeNotification(n.id)}
                    style={{ background: "none", border: "none", color: "var(--hint)", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: "64px 24px", textAlign: "center", background: "var(--bg2)" }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>🔔</div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>All caught up!</div>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No new purchase intelligence alerts.</p>
          </div>
        )}

      </div>
    </AppShell>
  );
}
