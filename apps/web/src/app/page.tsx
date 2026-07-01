"use client";

import React, { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-context";
import { CardTilt } from "@/components/ui/card-tilt";
import { 
  ChevronDown, 
  ArrowRight, 
  Play, 
  Star, 
  ShieldCheck, 
  Brain, 
  TrendingDown, 
  Search, 
  MessageSquare,
  CheckCircle2,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Bell
} from "lucide-react";

// --- ANIMATION HELPER ---
const FadeIn = ({ children, delay = 0, direction = "up", className = "" }: { children: React.ReactNode; delay?: number; direction?: "up" | "down" | "left" | "right" | "none"; className?: string }) => {
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- EMOJI / SVG ICONS ---
const Heart = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
);

// --- COMPONENT HELPERS ---
function Counter({ to, duration = 1800 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const startTime = performance.now();
    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(eased * to));
      if (progress < 1) requestAnimationFrame(step);
    }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(step); io.disconnect(); }
    });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}</span>;
}

const CYCLING_WORDS = ["Confidently.", "Intelligently.", "Without Regret.", "Like a Pro."];
function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = CYCLING_WORDS[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
    } else if (!deleting && displayed.length === word.length) {
      t = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % CYCLING_WORDS.length);
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, idx]);

  return (
    <span className="grad-text">
      {displayed}<span className="animate-pulse" style={{ color: "var(--teal)", opacity: 0.7 }}>|</span>
    </span>
  );
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: i % 3 === 0 ? "2px" : "1px",
            height: i % 3 === 0 ? "2px" : "1px",
            background: i % 4 === 0 ? "var(--teal)" : i % 4 === 1 ? "var(--blue)" : "var(--purple)",
            left: `${(i * 4.2 + 3) % 100}%`,
            top: `${(i * 7.1 + 10) % 100}%`,
            opacity: 0.4 + (i % 5) * 0.1,
            animation: `float-${i % 3} ${4 + (i % 4)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.4) % 3}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float-0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes float-1 { 0%,100%{transform:translateY(-8px) translateX(6px)} 50%{transform:translateY(10px) translateX(-6px)} }
        @keyframes float-2 { 0%,100%{transform:translateX(0)} 50%{transform:translateX(-12px) translateY(-8px)} }
      `}</style>
    </div>
  );
}

function MiniGauge({ score, color, size = 64 }: { score: number; color: string; size?: number }) {
  const r = size * 0.38;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)", width: size, height: size }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={size*0.09} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color}
          strokeWidth={size*0.09} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={fill}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1) 0.3s" }}
        />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: size * 0.25, color }}>{score}</div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const cursorRef = useRef<HTMLDivElement>(null);

  const [heroQuery, setHeroQuery] = useState("");
  const [heroScanning, setHeroScanning] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");
  const [subscribed, setSubscribed] = useState(false);

  // Mouse glow follow
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top  = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Parallax on hero orbs
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      if (orbARef.current) orbARef.current.style.transform = `translate(${x * 40}px, ${y * 40}px)`;
      if (orbBRef.current) orbBRef.current.style.transform = `translate(${x * -30}px, ${y * -30}px)`;
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHeroSearch = (e: FormEvent) => {
    e.preventDefault();
    if (heroQuery.trim()) {
      setHeroScanning(true);
      setTimeout(() => {
        router.push(`/analysis?q=${encodeURIComponent(heroQuery.trim())}`);
      }, 1200);
    }
  };

  const brands = ["Amazon", "Reddit", "YouTube", "Best Buy", "Walmart", "Google Shopping"];

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-[var(--accent)]" />,
      title: "AI Shopping Agent",
      description: "Our LLMs digest thousands of reviews instantly to give you a personalized executive consensus."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[var(--accent)]" />,
      title: "Regret Detector",
      description: "We spot common complaints hidden deep in 3-star reviews so you avoid buyer's remorse."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-[var(--accent)]" />,
      title: "Community Intelligence",
      description: "Aggregates real, unbiased opinions from Reddit comments, forums, and YouTube reviews."
    },
    {
      icon: <TrendingDown className="w-6 h-6 text-[var(--accent)]" />,
      title: "Price Prediction",
      description: "Historical pricing data and AI forecasting tells you whether to buy now or wait."
    },
    {
      icon: <Search className="w-6 h-6 text-[var(--accent)]" />,
      title: "Alternative Products",
      description: "Discovers hidden gems and better-value alternatives that standard search engines bury."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[var(--accent)]" />,
      title: "Personalized Advice",
      description: "Tell BuyWise what matters to you (e.g. durability over aesthetics) for custom scoring."
    }
  ];

  const reviews = [
    {
      name: "Sarah Jenkins",
      role: "Design Lead",
      content: "BuyWise saved me from buying a $2,000 espresso machine that apparently breaks after 6 months. It's the ultimate reality check for online shopping.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
    },
    {
      name: "Marcus Chen",
      role: "Software Engineer",
      content: "The way it pulls consensus from Reddit is magic. I don't have time to read 40 threads to figure out which monitor arm to buy. BuyWise does it in 3 seconds.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    },
    {
      name: "Elena Rodriguez",
      role: "Content Creator",
      content: "I use this for every single camera gear purchase now. It recommended a cheaper lens than I was planning to buy, and it's absolutely perfect.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
    }
  ];

  const faqs = [
    { q: "How accurate is the BuyWise score?", a: "Our models are trained on millions of verified purchases and cross-referenced against post-purchase sentiment on forums. We find our score accurately predicts long-term satisfaction 94% of the time." },
    { q: "Which websites do you support?", a: "We currently support Amazon, Best Buy, Walmart, Target, Home Depot, and thousands of Shopify stores. If there are reviews online, we can analyze them." },
    { q: "Do you use affiliate links?", a: "Yes, but our AI is strictly cordoned off from our monetization logic. A product's score is entirely objective; we never inflate scores for higher commissions." },
    { q: "Can I cancel my Pro subscription anytime?", a: "Absolutely. You can cancel your subscription with a single click in your account settings. No questions asked." }
  ];

  return (
    <div className="font-sans text-[var(--text)] bg-[var(--bg)] min-h-screen selection:bg-lime-200 selection:text-lime-900 relative overflow-hidden">
      {/* Mouse cursor glow background */}
      <div ref={cursorRef} id="cursor-glow" />

      {/* ─── HEADER / NAVBAR ─── */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border)] py-3 shadow-sm" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9EE55B] to-[#8cd147] flex items-center justify-center shadow-lg shadow-lime-500/20">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-900">
                <path d="M12 2L22 8.5L12 15L2 8.5L12 2Z" fill="currentColor" />
                <path d="M12 15L22 8.5V15.5L12 22L2 15.5V8.5L12 15Z" fill="currentColor" opacity="0.75" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--text)]">BuyWise</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">Pricing</a>
            <a href="#faq" className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">FAQ</a>
            <button onClick={() => router.push("/blog")} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">Blog</button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="btn-ghost btn-sm" 
              style={{ width: 34, height: 34, padding: 0, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <>
                <button onClick={() => router.push(user.role === "admin" ? "/admin" : "/dashboard")} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">Dashboard</button>
                <button onClick={() => router.push("/analysis")} className="px-5 py-2 rounded-full bg-[var(--text)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-all shadow-md hover:-translate-y-0.5">
                  Analyze
                </button>
              </>
            ) : (
              <>
                <button onClick={() => router.push("/login")} className="text-sm font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors">Login</button>
                <button onClick={() => router.push("/login")} className="px-5 py-2.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-sm font-medium hover:opacity-90 transition-all shadow-md hover:-translate-y-0.5">
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-[var(--text)]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4 flex flex-col gap-4 overflow-hidden"
            >
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[var(--muted)]">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[var(--muted)]">How it Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[var(--muted)]">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-[var(--muted)]">FAQ</a>
              <button onClick={() => { setMobileMenuOpen(false); router.push("/blog"); }} className="text-left text-base font-medium text-[var(--muted)]">Blog</button>
              <hr className="border-[var(--border)]" />
              <div className="flex flex-col gap-2 pt-2">
                <button 
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
                  className="w-full py-2.5 text-center font-medium text-[var(--text)] border border-[var(--border)] rounded-xl flex items-center justify-center gap-2"
                >
                  {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />} Toggle Theme
                </button>
                {user ? (
                  <>
                    <button onClick={() => { setMobileMenuOpen(false); router.push(user.role === "admin" ? "/admin" : "/dashboard"); }} className="w-full py-3 text-center font-medium text-[var(--text)] border border-[var(--border)] rounded-xl">Dashboard</button>
                    <button onClick={() => { setMobileMenuOpen(false); router.push("/analysis"); }} className="w-full py-3 text-center font-medium text-[var(--bg)] bg-[var(--text)] rounded-xl shadow-md">Analyze</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setMobileMenuOpen(false); router.push("/login"); }} className="w-full py-3 text-center font-medium text-[var(--text)] border border-[var(--border)] rounded-xl">Login</button>
                    <button onClick={() => { setMobileMenuOpen(false); router.push("/login"); }} className="w-full py-3 text-center font-medium text-[var(--bg)] bg-[var(--text)] rounded-xl shadow-md">Get Started</button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 z-0 h-full w-full bg-[var(--bg)] bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <Particles />

        {/* Parallax Orbs */}
        <div ref={orbARef} className="orb orb-teal" style={{ width: 600, height: 600, top: "10%", left: "-10%", opacity: 0.5, willChange: "transform" }} />
        <div ref={orbBRef} className="orb orb-blue" style={{ width: 500, height: 500, bottom: "5%", right: "-8%", opacity: 0.5, willChange: "transform" }} />

        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-center lg:text-left">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-100/50 dark:bg-lime-900/20 border border-lime-200/50 dark:border-lime-900/30 text-lime-700 dark:text-lime-400 text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                Introducing BuyWise 2.0
              </div>
              <h1 className="text-5xl md:text-[68px] leading-[1.08] font-extrabold text-[var(--text)] tracking-tight mb-6">
                Buy every product<br />
                <Typewriter />
              </h1>
            </FadeIn>
            
            <FadeIn delay={0.1}>
              <p className="text-lg text-[var(--muted)] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                BuyWise analyzes reviews, Reddit discussions, price history, and real customer complaints to tell you if a product is actually worth buying.
              </p>
            </FadeIn>

            {/* Interactive Search Scanner form */}
            <FadeIn delay={0.2}>
              <form onSubmit={handleHeroSearch} className="relative z-20 flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-full p-2 shadow-[var(--shadow-soft)] max-w-lg mx-auto lg:mx-0">
                <Search size={20} className="text-[var(--hint)] ml-4 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Paste URL or search product (e.g. Sony WH, MacBook)..." 
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  className="border-none bg-transparent flex-1 h-11 px-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--hint)]"
                  disabled={heroScanning}
                  required
                />
                <button type="submit" className="btn-primary rounded-full h-11 px-6 text-sm font-semibold shrink-0" disabled={heroScanning}>
                  {heroScanning ? "Scanning..." : "Analyze"}
                </button>
                {heroScanning && (
                  <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-[var(--accent)] overflow-hidden rounded-full">
                    <div className="skeleton-shimmer w-full h-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
                  </div>
                )}
              </form>
            </FadeIn>
          </div>

          {/* Upgraded 3D Floating Mockup Card */}
          <FadeIn delay={0.3} direction="left">
            <div className="relative w-full h-[450px] md:h-[500px] flex items-center justify-center perspective-[1000px]">
              {/* Main Sony WH card */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-[90%] md:w-[380px] bg-[var(--surface)] rounded-[28px] border border-[var(--border)] shadow-[var(--shadow-premium)] p-6 z-10 backdrop-blur-md"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-[16px] bg-[var(--surface-sec)] border border-[var(--border)] flex items-center justify-center text-xl">
                    🎧
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text)] text-sm">Sony WH-1000XM5</h3>
                    <p className="text-xs text-[var(--muted)]">Wireless Noise Canceling</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-2 w-full bg-[var(--bg-sec)] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[var(--teal)] to-[var(--blue)] w-[92%]" />
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-[var(--muted)] mb-1">BuyWise Score</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-[var(--text)]">92</span>
                        <span className="text-sm font-medium text-[var(--hint)]">/100</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Safe Buy
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-[20px] bg-[var(--bg-sec)] border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--muted)] mb-1 font-bold uppercase tracking-wider">Regret Risk</p>
                    <p className="text-lg font-black text-[var(--text)] flex items-center gap-2">
                      12% <TrendingDown className="w-4 h-4 text-emerald-500" />
                    </p>
                  </div>
                  <div className="p-4 rounded-[20px] bg-[var(--bg-sec)] border border-[var(--border)]">
                    <p className="text-[10px] text-[var(--muted)] mb-1 font-bold uppercase tracking-wider">Community</p>
                    <p className="text-lg font-black text-[var(--text)] flex items-center gap-2">
                      95% <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Price Dropping Badge */}
              <motion.div 
                animate={{ y: [0, 12, 0], x: [0, 4, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 right-0 md:-right-6 bg-[var(--surface)] border border-[var(--border)] p-4 rounded-[24px] shadow-xl z-20 w-44 backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text)]">Price Dropping</p>
                    <p className="text-[10px] text-[var(--muted)] leading-tight mt-0.5">Lowest price in 30 days. Perfect buy timing.</p>
                  </div>
                </div>
              </motion.div>

              {/* Reddit Review Badge */}
              <motion.div 
                animate={{ y: [0, -12, 0], x: [0, -4, 0] }} 
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-10 left-0 md:-left-8 bg-[var(--surface)] p-4 rounded-[24px] shadow-xl border border-[var(--border)] z-20 w-52 backdrop-blur-md"
              >
                <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mb-2">Top Reddit Review</p>
                <div className="flex gap-0.5 mb-1.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-xs text-[var(--text)] italic leading-relaxed">"ANC is absolutely mind-blowing. Totally worth it."</p>
                <div className="mt-2.5 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#FF4500] flex items-center justify-center"><span className="text-[9px] text-white font-bold">r/</span></div>
                  <span className="text-[10px] text-[var(--muted)] font-medium">r/headphones</span>
                </div>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TRUSTED BY SECTION ─── */}
      <section className="py-12 border-y border-[var(--border)] bg-[var(--surface-sec)] overflow-hidden relative">
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 30s linear infinite;
          }
        `}</style>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest mb-8">Aggregating shopping intelligence signals from</p>
          <div className="relative w-full overflow-hidden flex items-center">
            <div className="marquee-track flex items-center gap-6">
              {[...brands, "eBay", "Target", "Costco", "Trustpilot", ...brands, "eBay", "Target", "Costco", "Trustpilot"].map((brand, i) => (
                <div key={i} className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-6 py-3.5 shadow-sm font-bold text-sm tracking-tight text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-default select-none shrink-0">
                  <span>⚡</span> {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="py-24 md:py-32 bg-[var(--bg-sec)] relative">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--accent-glow)] blur-[120px] rounded-full opacity-30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <FadeIn>
              <div className="page-eyebrow text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">Feature Suite</div>
              <h2 className="text-4xl md:text-6xl font-black text-[var(--text)] tracking-tight mb-6">
                Everything you need to <br/> make the right call.
              </h2>
              <p className="text-lg text-[var(--muted)] font-light leading-relaxed">
                We replace hours of exhausting product reviews research with seconds of AI-powered clarity.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <CardTilt
                  style={{
                    background: "var(--surface)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 28,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                  className="group hover:border-lime-400/40 hover:shadow-[0_20px_50px_rgba(158,229,91,0.06)] transition-all duration-300 relative"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-lime-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-bl-full" />
                  <div className="p-8 flex flex-col h-full relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)] mb-3">{feature.title}</h3>
                    <p className="text-[var(--muted)] leading-relaxed font-light flex-1">{feature.description}</p>
                  </div>
                </CardTilt>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-24 md:py-32 bg-[var(--surface)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-gradient-to-bl from-lime-500/5 to-transparent -z-10 rounded-bl-[120px]" />
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          {/* Left Column (Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lime-100/50 dark:bg-lime-900/20 border border-lime-200/50 dark:border-lime-900/30 text-lime-700 dark:text-lime-400 text-xs font-semibold mb-4">
                Methodology
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight mb-6">
                Three steps to<br/>shopping nirvana.
              </h2>
              <p className="text-[var(--muted)] font-light leading-relaxed mb-8">
                Learn how BuyWise scans, cleans, and scores verified community ratings to isolate the real purchase verdict in seconds.
              </p>
              <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--text)] animate-bounce">
                ↓
              </div>
            </FadeIn>
          </div>

          {/* Right Column (Connected step cards) */}
          <div className="lg:col-span-8 space-y-12 relative">
            <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[var(--accent)] via-[var(--blue)] to-transparent opacity-20 z-0" />
            
            {[
              { step: "01", title: "Search Product Name or Paste URL", desc: "Type in any product keyword or paste a product link from Amazon, Best Buy, Walmart, or other popular retailers directly into our scanner." },
              { step: "02", title: "AI Crawls and Filters Reviews", desc: "Our engine reviews ratings, forum comments, post-purchase threads, and price datasets, stripping away bot entries and paid-influencer bias." },
              { step: "03", title: "Instant Report & Buyer's Score", desc: "Get a clear BuyWise score from 1-100, pros/cons bullet points, price alerts forecasts, and smart value alternatives." }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1} className="relative z-10 flex gap-6 md:gap-10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9EE55B] to-[#8cd147] flex items-center justify-center font-bold text-slate-950 shadow-md shrink-0 select-none">
                  {item.step}
                </div>
                <CardTilt
                  style={{
                    background: "var(--bg-sec)",
                    border: "1.5px solid var(--border)",
                    borderRadius: 24,
                    flex: 1,
                  }}
                  className="hover:border-lime-400/30 transition-all duration-300"
                >
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold text-[var(--text)] mb-3">{item.title}</h3>
                    <p className="text-[var(--muted)] font-light leading-relaxed text-sm">{item.desc}</p>
                  </div>
                </CardTilt>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEW SHOWCASE ─── */}
      <section className="py-24 md:py-32 bg-[var(--bg-sec)] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[var(--accent-glow)] blur-[140px] opacity-15 pointer-events-none rounded-full" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="page-eyebrow text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">Live Portal</div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight mb-6">
                A dashboard built for <br/> confident decisions.
              </h2>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-[28px] md:rounded-[40px] bg-[var(--surface)] border border-[var(--border)] shadow-[var(--shadow-premium)] overflow-hidden">
              {/* Browser Header Bar */}
              <div className="bg-[var(--surface-sec)] border-b border-[var(--border)] px-6 py-4 flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80" />
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex-1 max-w-md mx-auto bg-[var(--surface)] rounded-lg border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--hint)] text-center flex items-center justify-center gap-2 font-mono">
                  <Search className="w-3.5 h-3.5" /> buywise.ai/report/sony-xm5
                </div>
              </div>

              {/* Inside Dashboard panel */}
              <div className="flex flex-col md:flex-row h-[580px]">
                {/* Mock sidebar */}
                <div className="hidden md:block w-56 border-r border-[var(--border-sec)] p-6 bg-[var(--surface-sec)]">
                  <div className="w-24 h-6 bg-[var(--border)] rounded mb-8 animate-pulse" />
                  <div className="space-y-4">
                    {["Analysis Portal", "Price Watchlist", "Alternative Radar", "History Logs", "User Profile"].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded bg-[var(--border-sec)]" />
                        <span className="text-xs text-[var(--muted)] font-bold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main panel */}
                <div className="flex-1 p-6 md:p-10 bg-[var(--bg)] overflow-hidden relative">
                  <div className="flex flex-col gap-6 h-full justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="h-6 bg-[var(--surface)] border border-[var(--border)] rounded w-64 mb-2" />
                        <div className="h-4 bg-[var(--surface)] border border-[var(--border)] rounded w-48" />
                      </div>
                      <div className="w-32 h-11 bg-lime-500/10 border border-lime-500/20 rounded-xl flex items-center justify-center text-xs font-bold text-[var(--accent)]">✓ Synced</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-stretch">
                      {/* Price History Area Chart */}
                      <div className="col-span-2 bg-[var(--surface)] rounded-[24px] border border-[var(--border)] p-6 shadow-sm flex flex-col justify-between min-h-[180px]">
                        <div className="text-xs text-[var(--muted)] font-bold mb-4 uppercase tracking-wider">Price History Forecast</div>
                        <div className="flex-1 flex items-end gap-2.5 relative">
                          {/* SVG Line representation */}
                          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            <path d="M 0,90 Q 25,40 50,75 T 100,20 L 100,100 L 0,100 Z" fill="url(#chartGrad)" />
                            <path d="M 0,90 Q 25,40 50,75 T 100,20" fill="none" stroke="var(--teal)" strokeWidth="2.5" />
                          </svg>
                          <div className="absolute right-4 top-2 text-[10px] bg-[var(--surface-sec)] px-2 py-0.5 rounded border border-[var(--border)] font-bold text-white">Target Buy Zone</div>
                        </div>
                      </div>
                      
                      {/* Gauge box */}
                      <div className="bg-[var(--surface)] rounded-[24px] border border-[var(--border)] p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden min-h-[180px]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[var(--teal)] via-[var(--blue)] to-[var(--purple)] opacity-10" />
                        <div className="relative z-10 w-28 h-28 rounded-full bg-[var(--surface)] flex items-center justify-center shadow-lg border border-[var(--border)]">
                          <div className="text-center">
                            <div className="text-3xl font-black text-[var(--text)]">92</div>
                            <div className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-wider">Verdict</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent alerts log */}
                    <div className="bg-[var(--surface)] rounded-[24px] border border-[var(--border)] p-6 shadow-sm">
                      <div className="flex justify-between text-xs text-[var(--muted)] font-bold uppercase tracking-wider mb-4">
                        <span>Real-time Alert Logs</span>
                        <span className="text-[var(--accent)]">● Active</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-xs bg-[var(--bg-sec)] p-2.5 rounded-xl border border-[var(--border)]">
                          <span className="text-lime-400">✓</span>
                          <span className="text-[var(--text)]">Detected 14% price correction on Sony XM5 headphones. Price dropped to $318.00.</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs bg-[var(--bg-sec)] p-2.5 rounded-xl border border-[var(--border)] opacity-60">
                          <span className="text-lime-400">✓</span>
                          <span className="text-[var(--text)]">Analysis complete: MacBook Pro M4 score finalized at 88/100 (Safe Buy).</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section className="py-24 md:py-32 bg-[var(--surface)] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-20">
            <FadeIn>
              <div className="page-eyebrow text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">User Feedback</div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight mb-4">
                Loved by 240,000+ smart shoppers.
              </h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-[var(--bg-sec)] p-8 rounded-[28px] border border-[var(--border)] h-full flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                      </div>
                      <span className="text-[10px] bg-lime-500/10 text-lime-400 border border-lime-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Verified Buyer</span>
                    </div>
                    <p className="text-[var(--text)] text-lg mb-8 leading-relaxed font-semibold italic">"{review.content}"</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto border-t border-[var(--border-sec)] pt-4">
                    <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover border border-[var(--border)]" />
                    <div>
                      <h4 className="font-bold text-[var(--text)] text-sm">{review.name}</h4>
                      <p className="text-xs text-[var(--muted)]">{review.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING SECTION ─── */}
      <section id="pricing" className="py-24 md:py-32 bg-[var(--bg-sec)] relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <FadeIn>
              <div className="page-eyebrow text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">Subscription Plans</div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight mb-6">
                Simple, transparent pricing.
              </h2>
              <p className="text-lg text-[var(--muted)] mb-8 font-light">
                Save more on a single smart purchase than you will spend all year.
              </p>
              
              {/* Billing Toggle Switcher */}
              <div className="inline-flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-full p-1.5 shadow-sm select-none">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${billingPeriod === "monthly" ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--muted)]"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annually")}
                  className={`text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${billingPeriod === "annually" ? "bg-[var(--text)] text-[var(--bg)]" : "text-[var(--muted)]"}`}
                >
                  Annually <span className="bg-lime-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">Save 20%</span>
                </button>
              </div>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            {/* Free Tier */}
            <FadeIn delay={0.08}>
              <div className="bg-[var(--surface)] p-8 rounded-[32px] border border-[var(--border)] shadow-sm hover:border-[var(--border-sec)] transition-colors">
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">Free</h3>
                <p className="text-[var(--muted)] text-sm mb-6">For occasional shoppers.</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-[var(--text)]">$0</span>
                  <span className="text-[var(--muted)]">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {["5 analyses per month", "Basic BuyScore", "Top 3 alternatives", "Standard support"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--muted)] text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push("/login")} className="w-full py-3.5 rounded-xl font-bold text-[var(--text)] bg-[var(--bg-sec)] border border-[var(--border)] hover:bg-[var(--border)] transition-colors">
                  Get Started
                </button>
              </div>
            </FadeIn>

            {/* Pro Tier (Popular) */}
            <FadeIn delay={0.16} className="relative z-10 md:-mx-4">
              <div className="bg-slate-950 p-8 md:p-10 rounded-[32px] border border-lime-500/25 shadow-2xl transform md:scale-105">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#9EE55B] to-[#8cd147] text-slate-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                <p className="text-slate-400 text-sm mb-6">For savvy buyers.</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-white">
                    {billingPeriod === "monthly" ? "$9" : "$7"}
                  </span>
                  <span className="text-slate-400">/mo</span>
                  {billingPeriod === "annually" && <div className="text-[10px] text-lime-400 font-bold mt-1">Billed annually ($84/year)</div>}
                </div>
                <ul className="space-y-4 mb-8">
                  {["Unlimited analyses", "Deep Reddit & Forum scans", "Price drop alerts", "Priority support", "Historical data export"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[#9EE55B] shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push("/login")} className="w-full py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-[#9EE55B] to-[#8cd147] shadow-lg shadow-lime-500/20 hover:opacity-90 transition-opacity">
                  Start Free Trial
                </button>
              </div>
            </FadeIn>

            {/* Business Tier */}
            <FadeIn delay={0.24}>
              <div className="bg-[var(--surface)] p-8 rounded-[32px] border border-[var(--border)] shadow-sm hover:border-[var(--border-sec)] transition-colors">
                <h3 className="text-xl font-bold text-[var(--text)] mb-2">Business</h3>
                <p className="text-[var(--muted)] text-sm mb-6">For procurement teams.</p>
                <div className="mb-8">
                  <span className="text-4xl font-black text-[var(--text)]">
                    {billingPeriod === "monthly" ? "$49" : "$39"}
                  </span>
                  <span className="text-[var(--muted)]">/mo</span>
                  {billingPeriod === "annually" && <div className="text-[10px] text-[var(--accent)] font-bold mt-1">Billed annually ($468/year)</div>}
                </div>
                <ul className="space-y-4 mb-8">
                  {["Everything in Pro", "API Access", "Bulk URL analysis", "Custom scoring models", "Dedicated account manager"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--muted)] text-sm">
                      <CheckCircle2 className="w-4 h-4 text-[var(--accent)] shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => router.push("/login")} className="w-full py-3.5 rounded-xl font-bold text-[var(--text)] bg-[var(--bg-sec)] border border-[var(--border)] hover:bg-[var(--border)] transition-colors">
                  Contact Sales
                </button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section id="faq" className="py-24 bg-[var(--surface)] relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <div className="page-eyebrow text-xs font-bold text-[var(--accent)] uppercase tracking-wider mb-3">FAQ Help</div>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text)] tracking-tight">
              Common questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`border rounded-[24px] overflow-hidden bg-[var(--bg-sec)] transition-colors duration-300 ${openFaq === i ? "border-lime-500/30 shadow-sm" : "border-[var(--border)]"}`}>
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none select-none"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span className="font-bold text-[var(--text)] text-sm md:text-base">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[var(--muted)] transition-transform duration-300 ${openFaq === i ? "rotate-180 text-[var(--accent)]" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-[var(--muted)] font-light leading-relaxed text-xs md:text-sm border-t border-[var(--border-sec)] pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-950 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-lime-500/20 via-sky-500/10 to-transparent blur-[120px] rounded-full z-0" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
              Ready to shop smarter?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
              Join 240,000+ smart shoppers who never waste money on bad products. Start analyzing for free today.
            </p>
            <button onClick={() => router.push("/login")} className="px-10 py-5 rounded-full bg-white text-slate-950 font-extrabold text-lg hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Start Your Free Trial
            </button>
            <div className="mt-6 text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Demo Logins: user@demo.com / user123 · admin@demo.com / admin123
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[var(--surface)] border-t border-[var(--border)] py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-6 gap-10 md:gap-12">
          {/* Brand Info & Newsletter */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9EE55B] to-[#8cd147] flex items-center justify-center shadow-md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950">
                  <path d="M12 2L22 8.5L12 15L2 8.5L12 2Z" fill="currentColor" />
                  <path d="M12 15L22 8.5V15.5L12 22L2 15.5V8.5L12 15Z" fill="currentColor" opacity="0.75" />
                </svg>
              </div>
              <span className="font-extrabold text-lg text-[var(--text)] tracking-tight">BuyWise</span>
            </div>
            <p className="text-[var(--muted)] text-sm leading-relaxed max-w-sm font-light">
              The AI shopping assistant that aggregates verified reviews, forums, and spec benchmarks to prevent buyer's remorse before it happens.
            </p>
            
            {/* Newsletter Input Box */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-[var(--text)] uppercase tracking-wider">Newsletter updates</div>
              {subscribed ? (
                <div className="text-xs font-bold text-[var(--accent)] bg-lime-500/10 border border-lime-500/20 p-2.5 rounded-xl">✓ Thank you for subscribing!</div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-[var(--bg-sec)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs text-[var(--text)] placeholder-[var(--hint)] outline-none focus:border-[var(--accent)] flex-1"
                    required
                  />
                  <button type="submit" className="btn-primary rounded-xl px-4 py-2 text-xs font-bold shrink-0">Subscribe</button>
                </form>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-[var(--text)] mb-4 text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {["Features", "Pricing", "Extension", "Changelog"].map(link => (
                <li key={link}><a href="#" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-light">{link}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-[var(--text)] mb-4 text-xs uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              <li key="Blog"><button onClick={() => router.push("/blog")} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-light">Blog</button></li>
              {["Help Center", "Community", "API Docs"].map(link => (
                <li key={link}><a href="#" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-light">{link}</a></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-[var(--text)] mb-4 text-xs uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {["About", "Careers", "Privacy", "Terms"].map(link => (
                <li key={link}><a href="#" className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors font-light">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="flex md:flex-col gap-4 justify-end items-end md:items-end">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] cursor-pointer transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
            </div>
            <div className="w-8 h-8 rounded-full bg-[var(--bg-sec)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] cursor-pointer transition-colors shadow-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--hint)] font-semibold">© 2026 BuyWise Inc. All rights reserved. Backed by verified purchase sentiment telemetry.</p>
        </div>
      </footer>
    </div>
  );
}
