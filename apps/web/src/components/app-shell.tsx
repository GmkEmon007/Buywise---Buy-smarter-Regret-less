"use client";

import { useEffect, useState, useRef, ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { 
  Search, Home, BarChart2, ArrowLeftRight, 
  MessageSquare, Star, Clock, User, Settings, 
  LogOut, Sparkles, Bell, CreditCard, Sun, Moon,
  BookOpen
} from "lucide-react";

type NavItem = { href: string; label: string; icon: ReactNode };

export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  // Handle hotkeys (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!user) return null;

  const mainMenu: NavItem[] = [
    { href: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { href: "/analysis", label: "AI Analysis", icon: <BarChart2 size={18} /> },
    { href: "/compare", label: "Compare Specs", icon: <ArrowLeftRight size={18} /> },
    { href: "/chat", label: "AI Assistant", icon: <MessageSquare size={18} /> },
    { href: "/watchlist", label: "Watchlist", icon: <Star size={18} /> },
    { href: "/blog", label: "Blog", icon: <BookOpen size={18} /> },
  ];

  const preferenceMenu: NavItem[] = [
    { href: "/history", label: "History Logs", icon: <Clock size={18} /> },
    { href: "/profile", label: "My Profile", icon: <User size={18} /> },
    { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const commandItems = [
    { name: "Blog Articles & Guides", href: "/blog", icon: <BookOpen size={16} className="text-teal" /> },
    { name: "Analyze 'MacBook Air M4'", href: "/analysis?q=MacBook Air M4", icon: <Sparkles size={16} className="text-teal" /> },
    { name: "Analyze 'Sony WH-1000XM5'", href: "/analysis?q=Sony WH-1000XM5", icon: <Sparkles size={16} className="text-teal" /> },
    { name: "Analyze 'RTX 5070'", href: "/analysis?q=RTX 5070", icon: <Sparkles size={16} className="text-teal" /> },
    { name: "Compare Products", href: "/compare", icon: <ArrowLeftRight size={16} /> },
    { name: "Ask BuyWise AI Chat", href: "/chat", icon: <MessageSquare size={16} /> },
    { name: "Watchlist & Price Tracker", href: "/watchlist", icon: <Star size={16} /> },
    { name: "Search History", href: "/history", icon: <Clock size={16} /> },
    { name: "Personalized Recommendations", href: "/recommendations", icon: <Sparkles size={16} className="text-blue" /> },
    { name: "Settings & Configurations", href: "/settings", icon: <Settings size={16} /> },
    { name: "Manage Subscription", href: "/subscription", icon: <CreditCard size={16} /> },
    { name: "Notifications Center", href: "/notifications", icon: <Bell size={16} /> },
    ...(user.role === "admin" ? [{ name: "Admin Panel", href: "/admin", icon: <Settings size={16} className="text-amber" /> }] : []),
  ];

  const filteredCommands = commandItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearchSelect = (href: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(href);
  };

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Track buy decisions with AI recommendations.";
    if (pathname.startsWith("/blog")) return "Learn smart shopping strategies & AI consumer advice.";
    if (pathname.startsWith("/analysis")) return "Compile active purchase intelligence reports.";
    if (pathname.startsWith("/compare")) return "Simulate direct product traits comparisons.";
    if (pathname.startsWith("/chat")) return "Consult BuyWise AI on reviews consensus.";
    if (pathname.startsWith("/watchlist")) return "Monitor price forecasts and alerts.";
    if (pathname.startsWith("/history")) return "Review past market intelligence scans.";
    if (pathname.startsWith("/profile")) return "Configure personal user details.";
    if (pathname.startsWith("/settings")) return "Manage application setups & variables.";
    return "Track buy decisions.";
  };

  const getPageCategory = () => {
    if (pathname === "/dashboard") return "Home";
    if (pathname.startsWith("/blog")) return "Blog";
    if (pathname.startsWith("/analysis")) return "Product Analysis";
    if (pathname.startsWith("/compare")) return "Product Comparison";
    if (pathname.startsWith("/chat")) return "AI Assistant";
    if (pathname.startsWith("/watchlist")) return "Price Monitoring";
    if (pathname.startsWith("/history")) return "Scan Logs";
    if (pathname.startsWith("/profile")) return "Account Settings";
    if (pathname.startsWith("/settings")) return "Preferences";
    return "App";
  };

  return (
    <div className="app-layout">
      {/* ── LEFT SIDEBAR NAVIGATION (Fynix Design) ── */}
      <aside className="sidebar-nav">
        {/* Brand Logo */}
        <div className="sidebar-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--accent)" }}>
            <path d="M12 2L22 8.5L12 15L2 8.5L12 2Z" fill="currentColor" />
            <path d="M12 15L22 8.5V15.5L12 22L2 15.5V8.5L12 15Z" fill="currentColor" opacity="0.75" />
          </svg>
          <span style={{ fontWeight: 800 }}>BuyWise</span>
        </div>

        {/* User Block */}
        <div className="sidebar-profile">
          <div style={{ 
            width: 38, height: 38, borderRadius: "50%", 
            background: "var(--accent)", display: "flex", 
            alignItems: "center", justifyContent: "center", 
            fontWeight: 800, color: "#0c1204" 
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Personal Account
            </div>
          </div>
        </div>

        {/* Main Menu Links */}
        <div className="sidebar-menu-section">
          <div className="sidebar-menu-title">Main Menu</div>
          {mainMenu.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`sidebar-menu-item ${active ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Preference Links */}
        <div className="sidebar-menu-section">
          <div className="sidebar-menu-title">Preference</div>
          {preferenceMenu.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`sidebar-menu-item ${active ? "active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Upgrade Box */}
        <div className="sidebar-upgrade-card">
          <div style={{ fontSize: 24, marginBottom: 8 }}>💎</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Upgrade plan</div>
          <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4, marginBottom: 12 }}>
            Unlock smarter AI purchase insights today.
          </p>
          <button 
            className="btn-primary btn-sm" 
            style={{ width: "100%", height: 34, borderRadius: 10, fontSize: 11, background: "var(--text)", color: "var(--bg)", border: "none" }}
            onClick={() => router.push("/subscription")}
          >
            Upgrade Plan
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="page-container" style={{ animation: "pageEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <style>{`
          @keyframes pageEnter { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
          .fynix-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 32px;
            gap: 20px;
          }
          .fynix-search-kbd {
            font-size: 11px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 1px 6px;
            font-weight: 800;
            color: var(--muted);
          }
          .cmd-palette-backdrop {
            position: fixed;
            inset: 0;
            z-index: 200;
            background: rgba(5, 7, 10, 0.45);
            backdrop-filter: blur(16px);
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 15vh;
            animation: cmdFadeIn 0.2s ease;
          }
          .cmd-palette-box {
            width: 100%;
            max-width: 600px;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-premium);
            overflow: hidden;
            animation: cmdScaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .dark .cmd-palette-box {
            background: rgba(12, 15, 22, 0.95);
            backdrop-filter: blur(32px);
          }
          @keyframes cmdFadeIn { from{opacity: 0;} to{opacity: 1;} }
          @keyframes cmdScaleIn { from{opacity: 0; transform: scale(0.96) translateY(-10px);} to{opacity: 1; transform: scale(1) translateY(0);} }
          .cmd-search-input {
            width: 100%;
            height: 60px;
            background: transparent;
            border: none;
            border-bottom: 1px solid var(--border);
            outline: none;
            padding: 0 24px;
            font-size: 16px;
            color: var(--text);
            font-weight: 600;
          }
          .cmd-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 24px;
            cursor: pointer;
            transition: all 0.15s ease;
            font-size: 14px;
            font-weight: 700;
            color: var(--muted);
          }
          .cmd-item:hover {
            background: var(--bg-sec);
            color: var(--text);
          }
        `}</style>

        {/* Fynix Header Bar */}
        <header className="fynix-topbar">
          <div className="fynix-topbar-left">
            <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1.5px" }}>
              {getPageCategory()}
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "var(--text)", margin: "4px 0 0 0", letterSpacing: "-0.5px" }}>
              {getPageTitle()}
            </h1>
          </div>

          <div className="fynix-topbar-right">
            {/* Search Input Button */}
            <div className="fynix-search-wrapper" onClick={() => setIsOpen(true)}>
              <Search size={16} style={{ position: "absolute", left: 14, color: "var(--hint)" }} />
              <input 
                className="input" 
                placeholder="Search anything..." 
                readOnly 
                style={{ cursor: "pointer" }} 
              />
              <span style={{ position: "absolute", right: 14, fontSize: 10, fontWeight: 800, color: "var(--hint)", border: "1px solid var(--border)", borderRadius: 4, padding: "2px 4px" }}>
                ⌘K
              </span>
            </div>

            {/* Actions */}
            <button onClick={toggleTheme} className="btn-ghost btn-sm" style={{ width: 40, height: 40, padding: 0, borderRadius: 12, background: "var(--surface)", border: "1.5px solid var(--border)" }} title="Toggle Theme">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <Link href="/notifications" className="btn-ghost btn-sm" style={{ width: 40, height: 40, padding: 0, borderRadius: 12, position: "relative", background: "var(--surface)", border: "1.5px solid var(--border)" }} title="Notifications">
              <Bell size={16} />
              <span style={{ position: "absolute", top: 11, right: 11, width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} />
            </Link>

            <button onClick={() => { logout(); router.push("/"); }} className="btn-ghost btn-sm" style={{ width: 40, height: 40, padding: 0, borderRadius: 12, color: "var(--red)", background: "var(--surface)", border: "1.5px solid var(--border)" }} title="Sign Out">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* Command Palette Overlay */}
        {isOpen && (
          <div className="cmd-palette-backdrop" onClick={() => setIsOpen(false)}>
            <div className="cmd-palette-box" onClick={(e) => e.stopPropagation()}>
              <input 
                ref={inputRef}
                className="cmd-search-input" 
                type="text" 
                placeholder="Search anything (MacBook, RTX, Sony, Compare...)..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div style={{ maxHeight: 320, overflowY: "auto", padding: "8px 0" }}>
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => (
                    <div 
                      key={cmd.name}
                      className="cmd-item"
                      onClick={() => handleSearchSelect(cmd.href)}
                    >
                      {cmd.icon}
                      <span style={{ flex: 1 }}>{cmd.name}</span>
                      <kbd className="fynix-search-kbd" style={{ fontSize: 10 }}>Enter</kbd>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: "24px", textAlign: "center", color: "var(--hint)", fontSize: 14 }}>
                    No items found matching "{search}"
                  </div>
                )}
              </div>
              <div style={{ borderTop: "1.5px solid var(--border)", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--hint)", fontWeight: 600 }}>
                <span>Select option with mouse</span>
                <span>ESC to close</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}