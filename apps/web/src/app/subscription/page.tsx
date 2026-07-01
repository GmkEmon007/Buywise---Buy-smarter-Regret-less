"use client";

import { AppShell } from "@/components/app-shell";
import { 
  CreditCard, CheckCircle2, ChevronRight, BarChart3, 
  HelpCircle, Sparkles, ShieldCheck
} from "lucide-react";

export default function SubscriptionPage() {
  const invoices = [
    { date: "June 1, 2026", id: "INV-8329-01", amount: "$12.00", status: "Paid" },
    { date: "May 1, 2026", id: "INV-8329-02", amount: "$12.00", status: "Paid" },
    { date: "April 1, 2026", id: "INV-8329-03", amount: "$12.00", status: "Paid" }
  ];

  return (
    <AppShell>
      <div style={{ maxWidth: 840, margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="page-eyebrow">Billing & Credits</div>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <CreditCard size={34} className="text-teal" /> Subscriptions
          </h1>
        </div>

        {/* Current Plan Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 36 }}>
          
          {/* Plan detail card */}
          <div className="glass noise" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <span className="badge badge-teal" style={{ textTransform: "uppercase" }}>PRO PLAN ACTIVE</span>
                <h3 style={{ fontSize: 24, fontWeight: 900, marginTop: 8 }}>BuyWise Pro Premium</h3>
              </div>
              <Sparkles size={20} className="text-teal" />
            </div>

            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, marginBottom: 20 }}>
              Your premium billing cycles automatically on the 1st of every month. Enjoy unlimited analysis searches, advanced chat queries, and deep scraper options.
            </p>

            <div className="divider" style={{ margin: "18px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700 }}>MONTHLY BILLING</div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>$12.00 / mo</div>
              </div>
              <button className="btn-ghost btn-sm" style={{ borderRadius: 8 }}>
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Usage Stats progress card */}
          <div className="glass" style={{ padding: 28, borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--hint)", letterSpacing: "1px", marginBottom: 16 }}>API Usage Tracker</div>
              
              <div style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  <span>AI Scans Run</span>
                  <span>42 / Unlimited</span>
                </div>
                <div style={{ height: 8, background: "var(--border2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: "25%", height: "100%", background: "var(--teal)" }} />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  <span>Active Watchlist Trackers</span>
                  <span>3 / 20</span>
                </div>
                <div style={{ height: 8, background: "var(--border2)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: "15%", height: "100%", background: "var(--blue)" }} />
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: "var(--hint)", fontWeight: 600, display: "flex", gap: 5, alignItems: "center", marginTop: 20 }}>
              <HelpCircle size={12} /> Usage limits reset in 12 days
            </div>
          </div>

        </div>

        {/* Invoice Table list */}
        <div className="glass" style={{ borderRadius: "var(--radius-lg)", border: "1.5px solid var(--border)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1.5px solid var(--border)", fontWeight: 800, fontSize: 16 }}>
            Invoices & Billing History
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Billing Date</th>
                <th>Invoice ID</th>
                <th>Amount Paid</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 600 }}>{inv.date}</td>
                  <td style={{ color: "var(--muted)", fontFamily: "monospace" }}>{inv.id}</td>
                  <td style={{ fontWeight: 800 }}>{inv.amount}</td>
                  <td>
                    <span className="badge badge-teal">✓ {inv.status}</span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn-ghost" style={{ padding: "0 10px", height: 28, borderRadius: 6, fontSize: 11 }}>
                      Download PDF
                    </button>
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
