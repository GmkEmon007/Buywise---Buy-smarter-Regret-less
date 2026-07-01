"use client";

import { useAuth } from "@/context/auth-context";
import { AppShell } from "@/components/app-shell";
import { useRouter } from "next/navigation";
import { useState, useRef, FormEvent, useEffect } from "react";
import { CardTilt } from "@/components/ui/card-tilt";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { 
  Trash2, 
  Plus, 
  FileText, 
  Globe, 
  UserCheck, 
  Star, 
  Activity, 
  BarChart3, 
  Users, 
  Settings, 
  Database, 
  Server, 
  Smartphone, 
  Monitor, 
  ShieldAlert, 
  Cpu, 
  Heart, 
  Play, 
  ChevronDown, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  X, 
  Menu, 
  Search, 
  LogOut,
  Bell,
  HelpCircle,
  Moon,
  Sun,
  LayoutDashboard,
  Eye,
  DollarSign,
  Zap,
  TrendingUp as Sparkles
} from "lucide-react";

// --- STATIC CONFIG DATA ---
const INITIAL_BLOGS = [
  {
    title: "Why Reddit Reviews are More Reliable Than Retail Stars",
    slug: "why-reddit-reviews-reliable",
    summary: "How post-purchase sentiment on forums exposes structural flaws in verified retail star ratings.",
    content: "When shopping online, most buyers rely on the 4.5-star reviews they see on product pages. However, studies show that nearly 30% of these ratings are incentivized or outright fake. On Reddit communities, users write authentic, detailed reviews based on months of real-world use.",
    author: "Jane Doe",
    date: "Jun 28, 2026",
    readTime: "4 min read",
    category: "Guides"
  },
  {
    title: "An Analysis of the RTX 5070's True Price-to-Performance Ratio",
    slug: "rtx-5070-price-performance",
    summary: "Breaking down whether the new GPU release justifies its cost based on telemetry database benchmarks.",
    content: "The RTX 5070 has generated huge hype, but our BuyWise AI model predicts a moderate remorse risk due to limited VRAM upgrades. Let's dig into the frame metrics and community consensus to see if you should buy or wait.",
    author: "Alex Johnson",
    date: "Jun 24, 2026",
    readTime: "6 min read",
    category: "AI Tech"
  }
];

const RECENT_ANALYSES = [
  { product: "Sony WH-1000XM5", user: "John Doe", email: "john@example.com", avatar: "JD", buyScore: 94, date: "21 May 2025, 10:30 AM", status: "Completed", ratingText: "Excellent" },
  { product: "Apple MacBook Air M3", user: "Jane Smith", email: "jane@example.com", avatar: "JS", buyScore: 91, date: "21 May 2025, 10:20 AM", status: "Completed", ratingText: "Excellent" },
  { product: "iPhone 15 Pro Max", user: "Robert Brown", email: "robert@example.com", avatar: "RB", buyScore: 88, date: "21 May 2025, 10:10 AM", status: "Completed", ratingText: "Very Good" },
  { product: "Samsung Galaxy S24", user: "Emily Davis", email: "emily@example.com", avatar: "ED", buyScore: 85, date: "21 May 2025, 09:50 AM", status: "Completed", ratingText: "Very Good" },
  { product: "LG OLED C3 55\"", user: "Michael Lee", email: "michael@example.com", avatar: "ML", buyScore: 87, date: "21 May 2025, 09:30 AM", status: "Completed", ratingText: "Very Good" }
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Navigation tab route
  const [tab, setTab] = useState<
    "dashboard" | "traffic" | "users" | "products" | "ai" | "revenue" | "blog" | "logs" | "settings"
  >("dashboard");

  // Blog states
  const [blogs, setBlogs] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Guides");

  // Traffic time filters
  const [trafficFilter, setTrafficFilter] = useState<"Today" | "7 Days" | "30 Days" | "90 Days" | "1 Year">("7 Days");

  // User list states
  const [users, setUsers] = useState<any[]>([]);
  const [inviting, setInviting] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePassword, setInvitePassword] = useState("user123");
  const [inviteRole, setInviteRole] = useState<"user" | "admin">("user");

  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");

  // Global search mock query
  const [searchQuery, setSearchQuery] = useState("");

  // Seed user and blog lists from localStorage
  useEffect(() => {
    const storedBlogs = localStorage.getItem("buywise_blogs");
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    } else {
      localStorage.setItem("buywise_blogs", JSON.stringify(INITIAL_BLOGS));
      setBlogs(INITIAL_BLOGS);
    }

    const storedUsers = localStorage.getItem("buywise_users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      const defaultUsers = [
        { id: "u1", name: "Alex Johnson", email: "user@demo.com", role: "user", joined: "2024-11-15", analyses: 14, status: "active", password: "user123" },
        { id: "u2", name: "Mia Patel", email: "mia@demo.com", role: "user", joined: "2025-01-20", analyses: 7, status: "active", password: "user123" },
        { id: "u3", name: "James Liu", email: "james@demo.com", role: "user", joined: "2025-03-05", analyses: 22, status: "active", password: "user123" },
        { id: "u4", name: "Sara Kim", email: "sara@demo.com", role: "user", joined: "2025-02-14", analyses: 3, status: "suspended", password: "user123" },
        { id: "a1", name: "Admin User", email: "admin@demo.com", role: "admin", joined: "2024-01-01", analyses: 52, status: "active", password: "admin123" },
      ];
      localStorage.setItem("buywise_users", JSON.stringify(defaultUsers));
      setUsers(defaultUsers);
    }
  }, []);

  // Keyboard shortcut listener for global search: ⌘ K / Ctrl K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("admin-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Guard routing
  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/user");
  }, [user, router]);

  if (!user || user.role !== "admin") return null;

  // Stats summaries
  const totalAnalyses = users.reduce((a, u) => a + (u.analyses || 0), 0) + 134000;
  const activeUsers = users.filter(u => u.status === "active").length;

  // User functions
  const toggleUserStatus = (userId: string) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const newStatus = u.status === "active" ? "suspended" : "active";
        return { ...u, status: newStatus };
      }
      return u;
    });
    localStorage.setItem("buywise_users", JSON.stringify(updated));
    setUsers(updated);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updated = users.filter(u => u.id !== userId);
      localStorage.setItem("buywise_users", JSON.stringify(updated));
      setUsers(updated);
    }
  };

  const handleInviteSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    const newUser = {
      id: "u_" + Date.now(),
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      joined: new Date().toISOString().split("T")[0],
      analyses: 0,
      status: "active",
      password: invitePassword || "user123"
    };

    const updated = [...users, newUser];
    localStorage.setItem("buywise_users", JSON.stringify(updated));
    setUsers(updated);
    
    setInviteName("");
    setInviteEmail("");
    setInvitePassword("user123");
    setInviteRole("user");
    setInviting(false);
    alert("User invited successfully!");
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated = users.map(u => {
      if (u.id === editingUser.id) {
        return { ...u, name: editName, email: editEmail, role: editRole };
      }
      return u;
    });
    localStorage.setItem("buywise_users", JSON.stringify(updated));
    setUsers(updated);
    setEditingUser(null);
    alert("User settings updated successfully!");
  };

  // Blog publishing functions
  const handlePublish = (e: FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const slug = title.toLowerCase().trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPost = {
      title,
      slug,
      summary: summary || title.slice(0, 100) + "...",
      content,
      cover: cover || "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
      author: author || "Admin",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      readTime: `${Math.max(2, Math.ceil(content.split(" ").length / 180))} min read`,
      category
    };

    const updated = [newPost, ...blogs];
    localStorage.setItem("buywise_blogs", JSON.stringify(updated));
    setBlogs(updated);
    
    setTitle("");
    setSummary("");
    setContent("");
    alert("Blog post published successfully!");
  };

  const handleDeleteBlog = (slugToDelete: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      const updated = blogs.filter(b => b.slug !== slugToDelete);
      localStorage.setItem("buywise_blogs", JSON.stringify(updated));
      setBlogs(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F1F5F9] font-sans flex flex-col md:flex-row relative">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-full md:w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col shrink-0 z-20">
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1E293B] flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9EE55B] to-[#8cd147] flex items-center justify-center shadow-lg shadow-lime-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950">
              <path d="M12 2L22 8.5L12 15L2 8.5L12 2Z" fill="currentColor" />
              <path d="M12 15L22 8.5V15.5L12 22L2 15.5V8.5L12 15Z" fill="currentColor" opacity="0.75" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">BuyWise</span>
        </div>

        {/* User Card */}
        <div className="p-4 mx-4 my-4 bg-[#1E293B]/45 rounded-xl border border-[#334155]/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-lime-500/15 text-[#9EE55B] flex items-center justify-center font-bold border border-[#9EE55B]/20">
            A
          </div>
          <div>
            <div className="text-sm font-bold text-white">{user.name}</div>
            <div className="text-[10px] text-lime-400 font-semibold tracking-wider uppercase">Super Admin</div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto pb-6">
          <div>
            <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider px-3 mb-2">Main Menu</div>
            <div className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
                { id: "traffic", label: "Traffic Analytics", icon: <Globe size={16} /> },
                { id: "users", label: "Users", icon: <Users size={16} /> },
                { id: "products", label: "Products", icon: <Monitor size={16} /> },
                { id: "ai", label: "AI Analysis", icon: <Cpu size={16} /> },
                { id: "revenue", label: "Revenue", icon: <DollarSign size={16} /> },
                { id: "blog", label: "Blog Posts", icon: <FileText size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    tab === item.id 
                      ? "bg-lime-500/10 text-[#9EE55B] border border-lime-500/20" 
                      : "text-[#94A3B8] hover:bg-[#1E293B]/50 hover:text-white"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider px-3 mb-2">Preferences</div>
            <div className="space-y-1">
              {[
                { id: "logs", label: "System Logs", icon: <Activity size={16} /> },
                { id: "settings", label: "Settings", icon: <Settings size={16} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    tab === item.id 
                      ? "bg-lime-500/10 text-[#9EE55B] border border-lime-500/20" 
                      : "text-[#94A3B8] hover:bg-[#1E293B]/50 hover:text-white"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-[#1E293B]">
          <button 
            onClick={() => { logout(); router.push("/"); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/15 hover:bg-rose-500/10 transition-all"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B1220]">
        {/* Top Navbar Header */}
        <header className="h-16 border-b border-[#1E293B] bg-[#0F172A] px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" size={15} />
              <input
                id="admin-search"
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090D16] border border-[#1E293B] rounded-lg pl-9 pr-12 py-1.5 text-xs text-white placeholder-[#475569] outline-none focus:border-[#9EE55B] transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#1E293B] border border-[#334155] text-[9px] text-[#94A3B8] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">⌘ K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="text-[#94A3B8] hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative cursor-pointer text-[#94A3B8] hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-lime-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center">11</span>
            </div>
            <HelpCircle size={18} className="text-[#94A3B8] cursor-pointer hover:text-white transition-colors" />
            <div className="h-8 w-px bg-[#1E293B]" />
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-lime-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                A
              </div>
              <span className="hidden lg:inline text-xs font-bold text-white">Admin User</span>
            </div>
          </div>
        </header>

        {/* Primary Views */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* ───────────────── 1. OVERVIEW DASHBOARD ───────────────── */}
              {tab === "dashboard" && (
                <div className="space-y-6">
                  {/* Top KPIs Row */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { val: "24,532", label: "Total Users", pct: "+12.5%", color: "var(--teal)", points: "10,20 15,18 20,12 25,14 30,10 35,5 40,8" },
                      { val: "134,782", label: "Total Analyses", pct: "+18.7%", color: "var(--blue)", points: "10,20 15,15 20,17 25,10 30,8 35,12 40,5" },
                      { val: "56,341", label: "Products Analyzed", pct: "+14.3%", color: "var(--purple)", points: "10,20 15,19 20,14 25,12 30,15 35,8 40,4" },
                      { val: "$18,742", label: "Revenue (MTD)", pct: "+22.1%", color: "var(--amber)", points: "10,20 15,16 20,18 25,12 30,10 35,6 40,5" },
                    ].map((item, i) => (
                      <CardTilt key={item.label} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 20 }}>
                        <div className="p-6 flex justify-between items-center relative overflow-hidden">
                          <div>
                            <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mb-1">{item.label}</div>
                            <div className="text-3xl font-black text-white">{item.val}</div>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-lime-400 mt-2">
                              <TrendingUp size={12} /> {item.pct} <span className="text-[#475569] font-normal">vs last month</span>
                            </div>
                          </div>
                          {/* Mini Sparkline Chart */}
                          <svg className="w-16 h-10 overflow-visible opacity-80" viewBox="0 0 50 25">
                            <polyline
                              fill="none"
                              stroke={item.color}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              points={item.points}
                            />
                          </svg>
                        </div>
                      </CardTilt>
                    ))}
                  </div>

                  {/* Graph & Side Panels Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Line Chart (Analyses Overview) */}
                    <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-sm text-white">Analytics Overview</h3>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-lime-400" /> Analyses</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Users</div>
                            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Revenue</div>
                          </div>
                          <select className="bg-[#090D16] border border-[#1E293B] rounded-lg text-xs text-[#94A3B8] px-2.5 py-1.5 outline-none font-semibold cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>Last 90 Days</option>
                          </select>
                        </div>
                      </div>

                      {/* Mock Chart Area */}
                      <div className="flex-1 h-60 relative flex flex-col justify-between pt-4">
                        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#475569] font-bold pointer-events-none z-0">
                          {["60K", "45K", "30K", "15K", "0"].map(v => (
                            <div key={v} className="w-full flex items-center gap-3">
                              <span className="w-8 shrink-0">{v}</span>
                              <div className="flex-1 h-px bg-[#1E293B]/50" />
                            </div>
                          ))}
                        </div>

                        {/* Chart lines */}
                        <div className="flex-1 relative z-10 mx-10">
                          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                            {/* Analyses (Green) */}
                            <path d="M 0,80 L 16,75 L 32,55 L 48,65 L 64,52 L 80,68 L 100,45" fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" />
                            {/* Users (Blue) */}
                            <path d="M 0,90 L 16,84 L 32,70 L 48,78 L 64,68 L 80,78 L 100,60" fill="none" stroke="var(--blue)" strokeWidth="3" strokeLinecap="round" />
                            {/* Revenue (Purple) */}
                            <path d="M 0,95 L 16,92 L 32,85 L 48,90 L 64,82 L 80,90 L 100,78" fill="none" stroke="var(--purple)" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        </div>

                        {/* Chart X axis */}
                        <div className="flex justify-between text-[10px] text-[#475569] font-bold mx-10 mt-2">
                          {["May 15", "May 16", "May 17", "May 18", "May 19", "May 20", "May 21"].map(d => (
                            <span key={d}>{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* System Status column */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-sm text-white">System Status</h3>
                          <div className="flex items-center gap-1.5 text-xs text-lime-400 font-bold bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" /> Operational
                          </div>
                        </div>

                        <div className="space-y-4">
                          {[
                            { name: "API Server", status: "Operational", color: "text-lime-400" },
                            { name: "AI Service", status: "Operational", color: "text-lime-400" },
                            { name: "Database", status: "Operational", color: "text-lime-400" },
                            { name: "Redis Cache", status: "Operational", color: "text-lime-400" },
                            { name: "Background Jobs", status: "Operational", color: "text-lime-400" },
                          ].map(sys => (
                            <div key={sys.name} className="flex justify-between items-center text-xs border-b border-[#1E293B]/50 pb-3 last:border-none">
                              <span className="font-semibold text-[#94A3B8]">{sys.name}</span>
                              <span className={`font-bold ${sys.color}`}>{sys.status}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#1E293B]/60 text-center text-xs text-[#475569] font-bold">
                        All dependencies running normal
                      </div>
                    </div>
                  </div>

                  {/* Bottom details Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Analyses list */}
                    <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-[24px] overflow-hidden">
                      <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
                        <h3 className="font-bold text-sm text-white">Recent Analyses</h3>
                        <span className="text-xs font-bold text-lime-400 hover:underline cursor-pointer">View All</span>
                      </div>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th className="text-[#475569] font-bold text-xs uppercase tracking-wider">Product</th>
                            <th className="text-[#475569] font-bold text-xs uppercase tracking-wider">User</th>
                            <th className="text-[#475569] font-bold text-xs uppercase tracking-wider">Buy Score</th>
                            <th className="text-[#475569] font-bold text-xs uppercase tracking-wider">Analyzed At</th>
                            <th className="text-[#475569] font-bold text-xs uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {RECENT_ANALYSES.map((item, i) => (
                            <tr key={i} className="border-b border-[#1E293B]/50 last:border-none">
                              <td className="font-bold text-sm text-white flex items-center gap-2.5 py-4">
                                <span className="text-lg">🎧</span>
                                <div>
                                  <div>{item.product}</div>
                                  <div className="text-[10px] text-[#475569]">Headphones</div>
                                </div>
                              </td>
                              <td>
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold text-[10px]">
                                    {item.avatar}
                                  </div>
                                  <div>
                                    <div className="text-xs font-semibold text-white">{item.user}</div>
                                    <div className="text-[10px] text-[#475569]">{item.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="font-extrabold text-xs px-2 py-0.5 rounded-full bg-lime-500/10 text-[#9EE55B] border border-lime-500/20">{item.buyScore}</span>
                              </td>
                              <td className="text-xs text-[#94A3B8]">{item.date}</td>
                              <td>
                                <span className="text-xs text-lime-400 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-lime-400" /> Completed</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Top Categories and Activity right column */}
                    <div className="space-y-6">
                      {/* Top Categories */}
                      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-sm text-white">Top Categories</h3>
                          <span className="text-xs text-lime-400 hover:underline cursor-pointer font-bold">View All</span>
                        </div>
                        <div className="space-y-4">
                          {[
                            { name: "Electronics", pct: 42, color: "bg-lime-400" },
                            { name: "Computers", pct: 24, color: "bg-sky-400" },
                            { name: "Home Appliances", pct: 15, color: "bg-purple-500" },
                            { name: "Mobile Phones", pct: 10, color: "bg-amber-400" },
                            { name: "Others", pct: 9, color: "bg-[#475569]" },
                          ].map(c => (
                            <div key={c.name} className="space-y-1.5">
                              <div className="flex justify-between text-xs font-semibold">
                                <span className="text-[#94A3B8]">{c.name}</span>
                                <span className="text-white">{c.pct}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                                <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recent Activities timeline */}
                      <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="font-bold text-sm text-white">Recent Activities</h3>
                          <span className="text-xs text-lime-400 hover:underline cursor-pointer font-bold">View All</span>
                        </div>
                        <div className="space-y-4">
                          {[
                            { label: "New user registered", desc: "John Doe", time: "2m ago", color: "bg-lime-400/20 text-lime-400" },
                            { label: "Product analyzed", desc: "Sony WH-1000XM5", time: "5m ago", color: "bg-sky-500/20 text-sky-400" },
                            { label: "Blog post published", desc: "Top 10 Headphones in 2026", time: "1h ago", color: "bg-purple-500/20 text-purple-400" },
                            { label: "System backup completed", desc: "Backup 21 May, 2026", time: "3h ago", color: "bg-amber-500/20 text-amber-400" },
                          ].map((act, idx) => (
                            <div key={idx} className="flex gap-3 text-xs">
                              <div className={`w-8 h-8 rounded-xl ${act.color} flex items-center justify-center shrink-0`}>✓</div>
                              <div className="flex-1">
                                <div className="font-bold text-white">{act.label}</div>
                                <div className="text-[10px] text-[#475569]">{act.desc}</div>
                              </div>
                              <div className="text-[10px] text-[#475569] font-bold shrink-0">{act.time}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── 2. TRAFFIC ANALYTICS ───────────────── */}
              {tab === "traffic" && (
                <div className="space-y-6">
                  {/* Traffic KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {[
                      { val: "24,583", label: "Unique Visitors", shift: "↑ 18.2%", up: true },
                      { val: "41,920", label: "Total Visits", shift: "↑ 12.7%", up: true },
                      { val: "31.4%", label: "Bounce Rate", shift: "↓ 4.1%", up: false },
                      { val: "4m 21s", label: "Average Session", shift: "↑ 36 sec", up: true },
                      { val: "8.7%", label: "Conversion Rate", shift: "↑ 2.1%", up: true },
                      { val: "5,932", label: "New Users", shift: "↑ 14%", up: true },
                    ].map(item => (
                      <div key={item.label} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5">
                        <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mb-1">{item.label}</div>
                        <div className="text-2xl font-black text-white">{item.val}</div>
                        <div className={`text-[10px] font-extrabold mt-1.5 ${item.up ? "text-lime-400" : "text-rose-500"}`}>{item.shift}</div>
                      </div>
                    ))}
                  </div>

                  {/* Main Charts & live traffic */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Visitor Trend Line Chart */}
                    <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-sm text-white">Visitor Trend</h3>
                        <div className="flex items-center gap-1 bg-[#090D16] border border-[#1E293B] rounded-lg p-0.5">
                          {["Today", "7 Days", "30 Days", "90 Days", "1 Year"].map(item => (
                            <button
                              key={item}
                              onClick={() => setTrafficFilter(item as any)}
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${
                                trafficFilter === item 
                                  ? "bg-lime-500/10 text-[#9EE55B] border border-lime-500/15" 
                                  : "text-[#94A3B8] hover:text-white"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="h-60 relative flex flex-col justify-between pt-4">
                        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#475569] font-bold pointer-events-none z-0">
                          {["45K", "40K", "35K", "30K", "25K"].map(v => (
                            <div key={v} className="w-full flex items-center gap-3">
                              <span className="w-8 shrink-0">{v}</span>
                              <div className="flex-1 h-px bg-[#1E293B]/50" />
                            </div>
                          ))}
                        </div>

                        {/* Interactive dots representing visitors */}
                        <div className="flex-1 relative z-10 mx-10 flex items-center">
                          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path d="M 0,90 L 16,80 L 32,85 L 48,70 L 64,74 L 80,68 L 100,55" fill="none" stroke="var(--accent)" strokeWidth="3.5" strokeLinecap="round" />
                            {/* Dots */}
                            {[
                              { cx: 16, cy: 80 }, { cx: 48, cy: 70 }, { cx: 80, cy: 68 }
                            ].map((dot, idx) => (
                              <circle key={idx} cx={dot.cx} cy={dot.cy} r="4" fill="var(--accent)" stroke="white" strokeWidth="1.5" />
                            ))}
                          </svg>
                        </div>

                        <div className="flex justify-between text-[10px] text-[#475569] font-bold mx-10 mt-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                            <span key={d}>{d}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Live Visitors Right Box */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping" />
                          <h3 className="font-extrabold text-[10px] text-lime-400 uppercase tracking-widest">Live Right Now</h3>
                        </div>
                        <div className="text-4xl font-black text-white mb-6">132 <span className="text-xs text-[#94A3B8] font-semibold">Active Users</span></div>
                        <div className="space-y-3.5">
                          {[
                            { name: "USA", val: 42, color: "bg-lime-400" },
                            { name: "India", val: 31, color: "bg-sky-400" },
                            { name: "UK", val: 18, color: "bg-purple-500" },
                            { name: "Germany", val: 11, color: "bg-amber-400" },
                            { name: "Bangladesh", val: 8, color: "bg-[#475569]" },
                          ].map(sys => (
                            <div key={sys.name} className="flex justify-between items-center text-xs border-b border-[#1E293B]/50 pb-2.5 last:border-none">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${sys.color}`} />
                                <span className="font-bold text-[#94A3B8]">{sys.name}</span>
                              </div>
                              <span className="font-extrabold text-white">{sys.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-center text-[10px] text-[#475569] font-bold mt-4">
                        Refreshing live feeds…
                      </div>
                    </div>
                  </div>

                  {/* Secondary Traffic Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Traffic Sources & Country breakdown */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">Traffic Sources</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Google Search", pct: 42, color: "bg-lime-400" },
                          { name: "Direct", pct: 24, color: "bg-sky-400" },
                          { name: "Reddit", pct: 14, color: "bg-purple-500" },
                          { name: "YouTube", pct: 9, color: "bg-amber-400" },
                          { name: "Social Media", pct: 6, color: "bg-[#475569]" },
                          { name: "Referral", pct: 5, color: "bg-rose-500" },
                        ].map(sys => (
                          <div key={sys.name} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-[#94A3B8]">{sys.name}</span>
                              <span className="text-white">{sys.pct}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                              <div className={`h-full ${sys.color}`} style={{ width: `${sys.pct}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top countries world map */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white mb-6">Top Countries</h3>
                        <div className="space-y-4">
                          {[
                            { name: "USA", flag: "🇺🇸", val: "12,532" },
                            { name: "India", flag: "🇮🇳", val: "5,981" },
                            { name: "Bangladesh", flag: "🇧🇩", val: "3,202" },
                            { name: "UK", flag: "🇬🇧", val: "2,145" },
                            { name: "Canada", flag: "🇨🇦", val: "1,844" },
                          ].map(c => (
                            <div key={c.name} className="flex justify-between items-center text-xs">
                              <span className="font-semibold text-[#94A3B8] flex items-center gap-2"><span className="text-base">{c.flag}</span> {c.name}</span>
                              <span className="font-bold text-white">{c.val}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Simple visual map graphic represent */}
                      <div className="h-20 bg-[#090D16] border border-[#1E293B]/70 rounded-xl mt-6 flex items-center justify-center text-[10px] text-[#475569] font-bold">
                        Interactive World Map Visual
                      </div>
                    </div>

                    {/* Most Visited Pages */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">Most Visited Pages</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Home", val: "48,321" },
                          { name: "Dashboard", val: "24,188" },
                          { name: "Pricing", val: "11,923" },
                          { name: "Product Analysis", val: "8,921" },
                          { name: "AI Chat", val: "7,852" },
                        ].map(page => (
                          <div key={page.name} className="flex justify-between items-center text-xs border-b border-[#1E293B]/50 pb-2.5 last:border-none">
                            <span className="font-semibold text-[#94A3B8]">{page.name}</span>
                            <span className="font-extrabold text-white">{page.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Funnel & User devices grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Funnel Drop-off */}
                    <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">User Funnel</h3>
                      <div className="grid grid-cols-5 gap-3 text-center">
                        {[
                          { step: "Visited Website", val: "45,231" },
                          { step: "Signed Up", val: "7,240" },
                          { step: "Verified Email", val: "6,582" },
                          { step: "Used Analysis", val: "5,834" },
                          { step: "Subscribed", val: "623" },
                        ].map((funnel, idx) => (
                          <div key={idx} className="bg-[#090D16] border border-[#1E293B] rounded-xl p-4 flex flex-col justify-between h-36">
                            <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider leading-snug">{funnel.step}</div>
                            <div className="text-xl font-black text-white my-2">{funnel.val}</div>
                            {idx < 4 && <div className="text-[10px] text-lime-400 font-bold">↓</div>}
                          </div>
                        ))}
                      </div>
                      <div className="text-[11px] text-[#475569] font-medium text-center mt-4">
                        Shows where users drop off during their checkout journey.
                      </div>
                    </div>

                    {/* Devices & Browsers */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-white mb-6">User Devices & Tech</h3>
                        <div className="grid grid-cols-3 gap-3 text-center mb-6">
                          {[
                            { name: "Desktop", pct: "68%" },
                            { name: "Mobile", pct: "25%" },
                            { name: "Tablet", pct: "7%" },
                          ].map(item => (
                            <div key={item.name} className="bg-[#090D16] border border-[#1E293B]/70 rounded-xl p-3">
                              <div className="text-[10px] text-[#475569] font-bold uppercase">{item.name}</div>
                              <div className="text-lg font-black text-white mt-1">{item.pct}</div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between text-[#94A3B8]"><span>Chrome, Edge, Safari</span><span className="font-bold text-white">Browsers</span></div>
                          <div className="flex justify-between text-[#94A3B8]"><span>Windows, macOS, Linux</span><span className="font-bold text-white">Operating Systems</span></div>
                        </div>
                      </div>
                      <div className="h-12 bg-[#090D16] border border-[#1E293B]/70 rounded-xl flex items-center justify-center text-[10px] text-[#475569] font-bold mt-4">
                        Device Donut Chart
                      </div>
                    </div>
                  </div>

                  {/* Recent Visitors & Performance */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Visitors */}
                    <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-[24px] overflow-hidden">
                      <div className="p-6 border-b border-[#1E293B]">
                        <h3 className="font-bold text-sm text-white">Recent Visitors</h3>
                      </div>
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th>Time</th><th>Country</th><th>Device</th><th>Active Page</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { time: "2 sec ago", c: "🇺🇸 USA", dev: "Desktop", page: "Dashboard" },
                            { time: "15 sec ago", c: "🇮🇳 India", dev: "Mobile", page: "Pricing" },
                            { time: "27 sec ago", c: "🇬🇧 UK", dev: "Desktop", page: "Home" },
                            { time: "1 min ago", c: "🇨🇦 Canada", dev: "Mobile", page: "Product Analysis" },
                          ].map((v, i) => (
                            <tr key={i} className="border-b border-[#1E293B]/50 last:border-none">
                              <td className="text-xs text-white py-3">{v.time}</td>
                              <td className="text-xs text-[#94A3B8] font-bold">{v.c}</td>
                              <td className="text-xs text-[#94A3B8]">{v.dev}</td>
                              <td className="text-xs text-[#94A3B8] font-bold">{v.page}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Performance Core Web Vitals */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">Website Performance</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-[#090D16] border border-[#1E293B] p-4 rounded-xl">
                          <span className="text-xs text-[#94A3B8] font-bold">Avg Load Time</span>
                          <span className="text-xl font-black text-lime-400">1.2 s</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { name: "LCP", val: "1.8 s", status: "Good" },
                            { name: "CLS", val: "0.01", status: "Good" },
                            { name: "INP", val: "118 ms", status: "Needs Imp" },
                          ].map(vital => (
                            <div key={vital.name} className="bg-[#090D16] border border-[#1E293B]/70 p-3 rounded-xl text-center">
                              <div className="text-[10px] text-[#475569] font-bold">{vital.name}</div>
                              <div className="text-xs font-black text-white my-1">{vital.val}</div>
                              <div className="text-[9px] text-lime-400 font-bold">{vital.status}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── 3. USERS MANAGEMENT ───────────────── */}
              {tab === "users" && (
                <div className="space-y-6">
                  {/* Top action bar */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-black text-white">Users Directory</h2>
                    <button 
                      onClick={() => setInviting(!inviting)} 
                      className="btn-primary rounded-xl flex items-center gap-1 px-4 py-2 text-xs font-bold shrink-0"
                    >
                      <Plus size={14} /> Invite user
                    </button>
                  </div>

                  {/* Invite forms */}
                  {inviting && (
                    <div className="bg-[#0F172A] border border-lime-500/20 p-6 rounded-[24px]">
                      <h3 className="text-sm font-bold text-white mb-4">Invite New User</h3>
                      <form onSubmit={handleInviteSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                          type="text" 
                          placeholder="Name" 
                          value={inviteName}
                          onChange={(e) => setInviteName(e.target.value)}
                          className="bg-[#090D16] border border-[#1E293B] p-2.5 rounded-xl text-xs text-white outline-none"
                          required
                        />
                        <input 
                          type="email" 
                          placeholder="Email" 
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="bg-[#090D16] border border-[#1E293B] p-2.5 rounded-xl text-xs text-white outline-none"
                          required
                        />
                        <select 
                          value={inviteRole} 
                          onChange={(e: any) => setInviteRole(e.target.value)}
                          className="bg-[#090D16] border border-[#1E293B] p-2.5 rounded-xl text-xs text-[#94A3B8] outline-none font-semibold"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className="btn-primary rounded-xl text-xs font-bold">Invite</button>
                      </form>
                    </div>
                  )}

                  {/* Edit forms */}
                  {editingUser && (
                    <div className="bg-[#0F172A] border border-sky-500/20 p-6 rounded-[24px]">
                      <h3 className="text-sm font-bold text-white mb-4">Edit Profile: {editingUser.name}</h3>
                      <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input 
                          type="text" 
                          placeholder="Name" 
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-[#090D16] border border-[#1E293B] p-2.5 rounded-xl text-xs text-white outline-none"
                          required
                        />
                        <input 
                          type="email" 
                          placeholder="Email" 
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                          className="bg-[#090D16] border border-[#1E293B] p-2.5 rounded-xl text-xs text-white outline-none"
                          required
                        />
                        <select 
                          value={editRole} 
                          onChange={(e: any) => setEditRole(e.target.value)}
                          className="bg-[#090D16] border border-[#1E293B] p-2.5 rounded-xl text-xs text-[#94A3B8] outline-none font-semibold"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className="btn-primary rounded-xl text-xs font-bold">Save</button>
                      </form>
                    </div>
                  )}

                  {/* Users table list */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] overflow-hidden">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>User</th><th>Role</th><th>Joined</th><th>Analyses</th><th>Status</th><th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u, i) => (
                          <tr key={u.id} className="border-b border-[#1E293B]/50 last:border-none">
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-lime-500/10 text-lime-400 flex items-center justify-center font-bold text-xs border border-lime-500/20">
                                  {(u.name || "").split(" ").map((n: string) => n ? n[0] : "").join("")}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-white">{u.name}</div>
                                  <div className="text-[10px] text-[#475569]">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-amber-500/10 text-amber-400 border border-amber-500/25" : "bg-sky-500/10 text-sky-400 border border-sky-500/25"}`}>{u.role}</span>
                            </td>
                            <td className="text-xs text-[#94A3B8]">{u.joined}</td>
                            <td className="text-xs font-bold text-white">{u.analyses}</td>
                            <td>
                              <button 
                                onClick={() => toggleUserStatus(u.id)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                                  u.status === "active" 
                                    ? "bg-lime-500/10 text-[#9EE55B] border-lime-500/20 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20" 
                                    : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-lime-500/10 hover:text-[#9EE55B] hover:border-lime-500/20"
                                }`}
                              >
                                {u.status === "active" ? "Active" : "Suspended"}
                              </button>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingUser(u);
                                    setEditName(u.name);
                                    setEditEmail(u.email);
                                    setEditRole(u.role);
                                  }}
                                  className="px-2 py-1 bg-[#1E293B] border border-[#334155] text-[10px] text-white font-bold rounded-lg hover:border-lime-400 transition-colors"
                                >
                                  Edit
                                </button>
                                {u.id !== "a1" && (
                                  <button 
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-1.5 bg-[#1E293B]/70 border border-[#334155] text-rose-400 rounded-lg hover:border-rose-500 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ───────────────── 4. PRODUCTS & SEARCH ANALYTICS ───────────────── */}
              {tab === "products" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Search Analytics most searched list */}
                    <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">Search Analytics</h3>
                      <div className="space-y-4">
                        {[
                          { name: "Sony WH-1000XM5", queries: 2452, pct: 45, color: "bg-lime-400" },
                          { name: "RTX 5070 (Predicted)", queries: 1845, pct: 36, color: "bg-sky-400" },
                          { name: "MacBook Air M4", queries: 1412, pct: 28, color: "bg-purple-500" },
                          { name: "iPhone 17 Pro", queries: 1102, pct: 22, color: "bg-amber-400" },
                          { name: "Steam Deck OLED", queries: 923, pct: 18, color: "bg-rose-500" },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 text-xs">
                            <span className="font-bold text-[#475569] w-6">#{idx+1}</span>
                            <div className="flex-1">
                              <div className="flex justify-between font-semibold mb-1">
                                <span className="text-[#94A3B8]">{item.name}</span>
                                <span className="text-white">{item.queries} searches</span>
                              </div>
                              <div className="h-1.5 w-full bg-[#1E293B] rounded-full overflow-hidden">
                                <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Simple recommendations list */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">Products Watchlist</h3>
                      <div className="space-y-4">
                        {[
                          { name: "iPad Pro 13\"", score: 76, verdict: "Wait", color: "text-amber-400" },
                          { name: "Asus ROG Ally X", score: 91, verdict: "Buy", color: "text-lime-400" },
                          { name: "Bose QuietComfort Ultra", score: 89, verdict: "Buy", color: "text-lime-400" },
                          { name: "GoPro Hero 12", score: 62, verdict: "Skip", color: "text-rose-500" },
                        ].map(item => (
                          <div key={item.name} className="flex justify-between items-center text-xs border-b border-[#1E293B]/50 pb-3 last:border-none">
                            <div>
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-[10px] text-[#475569]">Score: {item.score}/100</div>
                            </div>
                            <span className={`font-bold ${item.color}`}>{item.verdict}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── 5. AI USAGE ANALYTICS ───────────────── */}
              {tab === "ai" && (
                <div className="space-y-6">
                  {/* AI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      { val: "4,521", label: "AI Analyses Today", color: "text-lime-400" },
                      { val: "2.4M", label: "Tokens Used", color: "text-sky-400" },
                      { val: "1.8 s", label: "Average Response Time", color: "text-purple-400" },
                      { val: "99.7%", label: "AI Success Rate", color: "text-amber-400" },
                    ].map(item => (
                      <div key={item.label} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-6 text-center">
                        <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mb-1.5">{item.label}</div>
                        <div className={`text-3xl font-black ${item.color}`}>{item.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* AI Logs */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] overflow-hidden">
                    <div className="p-6 border-b border-[#1E293B]">
                      <h3 className="font-bold text-sm text-white">AI Analysis Response Logs</h3>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Task</th><th>Tokens</th><th>Latency</th><th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { task: "Sentiment analysis: Sony WH-1000XM5", tokens: "42k", latency: "1.4s", status: "Success" },
                          { task: "Price projection model: RTX 5070", tokens: "68k", latency: "2.1s", status: "Success" },
                          { task: "Regret calculation review: MacBook Air M4", tokens: "31k", latency: "1.2s", status: "Success" },
                        ].map((log, idx) => (
                          <tr key={idx} className="border-b border-[#1E293B]/50 last:border-none">
                            <td className="text-xs text-white py-3">{log.task}</td>
                            <td className="text-xs text-[#94A3B8] font-bold">{log.tokens}</td>
                            <td className="text-xs text-[#94A3B8]">{log.latency}</td>
                            <td className="text-xs text-lime-400 font-bold">{log.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ───────────────── 6. REVENUE ANALYTICS ───────────────── */}
              {tab === "revenue" && (
                <div className="space-y-6">
                  {/* Stripes Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {[
                      { val: "$18,400", label: "MRR", pct: "+12%" },
                      { val: "$220,800", label: "ARR", pct: "+12%" },
                      { val: "23,412", label: "Free Users", pct: "+4%" },
                      { val: "1,542", label: "Pro Users", pct: "+18%" },
                      { val: "2.1%", label: "Churn", pct: "-0.2%" },
                      { val: "8.3%", label: "Conversion", pct: "+1.1%" },
                    ].map(item => (
                      <div key={item.label} className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5">
                        <div className="text-[10px] font-bold text-[#475569] uppercase tracking-wider mb-1">{item.label}</div>
                        <div className="text-2xl font-black text-white">{item.val}</div>
                        <div className="text-[10px] text-lime-400 font-extrabold mt-1.5">{item.pct}</div>
                      </div>
                    ))}
                  </div>

                  {/* Revenue Funnel visual */}
                  <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 text-center text-xs text-[#94A3B8]">
                    <h3 className="font-bold text-sm text-white text-left mb-6">Revenue Subscriptions Split</h3>
                    <div className="h-44 bg-[#090D16] border border-[#1E293B] rounded-xl flex items-center justify-center font-bold text-[#475569]">
                      Interactive Revenue Plans Line Graph Representation
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── 7. BLOG MANAGER ───────────────── */}
              {tab === "blog" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Publishing Form */}
                    <div className="lg:col-span-2 bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">Write New Blog Post</h3>
                      <form onSubmit={handlePublish} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-[#090D16] border border-[#1E293B] p-3 rounded-xl text-xs text-white outline-none"
                            required
                          />
                          <input 
                            type="text" 
                            placeholder="Author Name (e.g. John Doe)" 
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="bg-[#090D16] border border-[#1E293B] p-3 rounded-xl text-xs text-white outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input 
                            type="text" 
                            placeholder="Summary Outline" 
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="bg-[#090D16] border border-[#1E293B] p-3 rounded-xl text-xs text-white outline-none"
                          />
                          <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-[#090D16] border border-[#1E293B] p-3 rounded-xl text-xs text-[#94A3B8] outline-none font-semibold"
                          >
                            <option>Guides</option>
                            <option>AI Tech</option>
                            <option>Smart Shopping</option>
                          </select>
                        </div>
                        <textarea 
                          placeholder="Write post content here (Markdown or HTML supported)..." 
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full h-48 bg-[#090D16] border border-[#1E293B] p-4 rounded-xl text-xs text-white outline-none resize-none"
                          required
                        />
                        <button type="submit" className="btn-primary rounded-xl text-xs font-bold px-6 py-2.5">Publish Article</button>
                      </form>
                    </div>

                    {/* Blog list */}
                    <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6">
                      <h3 className="font-bold text-sm text-white mb-6">Published Articles</h3>
                      <div className="space-y-4">
                        {blogs.map(b => (
                          <div key={b.slug} className="flex justify-between items-start border-b border-[#1E293B]/50 pb-3 last:border-none">
                            <div className="flex-1 pr-3">
                              <div className="font-bold text-white text-xs line-clamp-1">{b.title}</div>
                              <div className="text-[10px] text-[#475569] mt-0.5">{b.date} · {b.category}</div>
                            </div>
                            <button 
                              onClick={() => handleDeleteBlog(b.slug)}
                              className="text-rose-400 hover:text-rose-500 p-1 shrink-0"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── 8. SYSTEM HEALTH & LOGS ───────────────── */}
              {tab === "logs" && (
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] overflow-hidden">
                  <div className="p-6 border-b border-[#1E293B] flex justify-between items-center">
                    <h3 className="font-bold text-sm text-white">System Events Logs</h3>
                    <span className="text-xs text-lime-400 font-bold bg-lime-500/10 border border-lime-500/20 px-2 py-0.5 rounded-full animate-pulse">Live Logging</span>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Time</th><th>Severity</th><th>Service</th><th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { time: "21:35:42", level: "INFO", src: "API GATEWAY", msg: "Route authenticated successfully for alex@demo.com" },
                        { time: "21:34:11", level: "INFO", src: "AI ENGINE", msg: "Token count parsed for MacBook Air analysis prompt: 14k tokens" },
                        { time: "21:30:05", level: "WARN", src: "REDIS CACHE", msg: "Latency spike detected in telemetry fetch: 18ms" },
                        { time: "21:28:14", level: "INFO", src: "DATABASE", msg: "Successfully wrote analysis ID: an_4831201 to cache" },
                      ].map((item, idx) => (
                        <tr key={idx} className="border-b border-[#1E293B]/50 last:border-none">
                          <td className="text-xs text-[#94A3B8] font-bold py-3">{item.time}</td>
                          <td>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                              item.level === "WARN" ? "bg-amber-500/10 text-amber-400" : "bg-lime-500/10 text-lime-400"
                            }`}>{item.level}</span>
                          </td>
                          <td className="text-xs font-bold text-white">{item.src}</td>
                          <td className="text-xs text-[#94A3B8]">{item.msg}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ───────────────── 9. GENERAL SETTINGS ───────────────── */}
              {tab === "settings" && (
                <div className="bg-[#0F172A] border border-[#1E293B] rounded-[24px] p-6 max-w-xl">
                  <h3 className="font-bold text-sm text-white mb-6">General System Settings</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#94A3B8]">AI Mocking Simulation</span>
                      <input type="checkbox" defaultChecked className="accent-[#9EE55B] cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#94A3B8]">Enable Telemetry database tracker</span>
                      <input type="checkbox" defaultChecked className="accent-[#9EE55B] cursor-pointer" />
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-[#94A3B8]">Force light theme default</span>
                      <input type="checkbox" className="accent-[#9EE55B] cursor-pointer" />
                    </div>
                    <div className="pt-4 border-t border-[#1E293B] flex justify-end">
                      <button className="btn-primary rounded-xl text-xs font-bold px-4 py-2">Save Settings</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
