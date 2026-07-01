"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useTheme } from "next-themes";
import { 
  User, Bell, Shield, Key, Sparkles, 
  CreditCard, ChevronRight, Moon, Sun
} from "lucide-react";

type SettingRow = {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  enabled?: boolean;
  value?: string;
  action?: () => void;
};

type SettingSection = {
  title: string;
  rows: SettingRow[];
};

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [dataRetention, setDataRetention] = useState(true);

  const sections: SettingSection[] = [
    {
      title: "Account & Access",
      rows: [
        { id: "profile", label: "Profile Information", desc: "Manage username and avatar details", icon: <User size={16} />, value: "Premium Plan" },
        { id: "security", label: "Security & Passwords", desc: "Configure multi-factor credentials", icon: <Key size={16} /> }
      ]
    },
    {
      title: "Preferences",
      rows: [
        { 
          id: "theme", 
          label: "Theme Selection", 
          desc: `Current theme: ${theme}`, 
          icon: theme === "dark" ? <Moon size={16} /> : <Sun size={16} />, 
          action: () => setTheme(theme === "dark" ? "light" : "dark") 
        },
        { 
          id: "notifications", 
          label: "Price Notifications", 
          desc: "Trigger email on price drop detections", 
          icon: <Bell size={16} />, 
          enabled: notifications, 
          action: () => setNotifications(!notifications) 
        }
      ]
    },
    {
      title: "AI & Data Options",
      rows: [
        { id: "ai", label: "AI Analysis Model", desc: "GPT-4o purchase summary processing", icon: <Sparkles size={16} />, value: "Active" },
        { 
          id: "retention", 
          label: "Data Retention", 
          desc: "Keep records history saved in workspace", 
          icon: <Shield size={16} />, 
          enabled: dataRetention, 
          action: () => setDataRetention(!dataRetention) 
        }
      ]
    },
    {
      title: "Subscriptions",
      rows: [
        { id: "billing", label: "Usage & Billing", desc: "View invoices and usage trackers", icon: <CreditCard size={16} /> }
      ]
    }
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="page-eyebrow">Settings</div>
          <h1 className="page-title">Workspace Controls</h1>
        </div>

        {/* Apple Settings Row Stacks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {sections.map((section) => (
            <div key={section.title}>
              
              {/* Section Header */}
              <div style={{ 
                fontSize: 11, fontWeight: 700, textTransform: "uppercase", 
                color: "var(--hint)", letterSpacing: "1.5px", marginBottom: 8,
                paddingLeft: 12
              }}>
                {section.title}
              </div>

              {/* Rows Stack Wrapper */}
              <div className="glass" style={{ 
                borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", 
                overflow: "hidden" 
              }}>
                {section.rows.map((row, idx) => (
                  <div 
                    key={row.id}
                    onClick={row.action}
                    style={{
                      display: "flex", alignItems: "center", justifyItems: "center", 
                      padding: "16px 20px", cursor: row.action ? "pointer" : "default",
                      borderBottom: idx === section.rows.length - 1 ? "none" : "1.5px solid var(--border)",
                      background: "var(--surface)",
                      justifyContent: "space-between",
                      transition: "background 0.2s"
                    }}
                    className={row.action ? "nav-link" : ""}
                  >
                    
                    {/* Icon + details */}
                    <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ 
                        width: 28, height: 28, borderRadius: "50%", background: "var(--bg2)", 
                        border: "1px solid var(--border)", display: "flex", alignItems: "center", 
                        justifyContent: "center", color: "var(--teal)" 
                      }}>
                        {row.icon}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: "var(--text)" }}>{row.label}</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{row.desc}</div>
                      </div>
                    </div>

                    {/* Action toggles or details values */}
                    <div>
                      {row.enabled !== undefined ? (
                        <button 
                          role="switch" 
                          aria-checked={row.enabled}
                          style={{ 
                            width: 44, height: 24, borderRadius: 12, 
                            background: row.enabled ? "var(--teal)" : "var(--border2)", 
                            border: "none", position: "relative", cursor: "pointer", 
                            transition: "all 0.2s" 
                          }}
                        >
                          <span style={{ 
                            position: "absolute", top: 3, 
                            left: row.enabled ? "calc(100% - 21px)" : 3, 
                            width: 18, height: 18, borderRadius: "50%", 
                            background: "#040609", transition: "left 0.2s" 
                          }} />
                        </button>
                      ) : row.value ? (
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>{row.value}</span>
                      ) : (
                        <ChevronRight size={14} style={{ color: "var(--hint)" }} />
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </AppShell>
  );
}
