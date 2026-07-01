"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { CardTilt } from "@/components/ui/card-tilt";
import { BookOpen, Search, ArrowLeft, ArrowRight, User, Calendar, Clock, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export interface BlogPost {
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const DEFAULT_POSTS: BlogPost[] = [
  {
    title: "How to Spot Fake Reviews on Amazon Using AI",
    slug: "how-to-spot-fake-reviews-on-amazon-using-ai",
    summary: "Learn how modern merchants manufacture authentic-looking ratings, and how BuyWise AI classification models identify automated feedback loops.",
    cover: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=60",
    author: "Sarah Jenkins (AI Research Lead)",
    date: "June 28, 2026",
    readTime: "5 min read",
    category: "Guides",
    content: `<h3>The Epidemic of Modern Review Manipulation</h3>
<p>Online shopping has become a pillar of modern consumer convenience, yet it rests on a fragile foundation of trust. That trust is built on user reviews—a system that is increasingly compromised. Sellers now employ sophisticated networks of automated bots, incentivized testers, and generative AI models to construct legions of highly realistic, positive feedback to inflate their product metrics.</p>

<h3>How BuyWise Exposes the Patterns</h3>
<p>While human shoppers are easily swayed by polished five-star ratings, machine learning classifiers look beyond individual reviews to identify structural anomalies. Our review trust index evaluates several criteria:</p>
<ul>
  <li><strong>Review Burst Influx</strong>: A sudden surge in reviews within a 24-hour period, typically indicating a coordinated campaign.</li>
  <li><strong>Syntactic Redundancy</strong>: Generative AI models leave distinct semantic footprints. We scan for repetitive sentence structures and recurring buzzwords.</li>
  <li><strong>Reviewer Account Age & History</strong>: Profiles that exclusively post five-star reviews for unverified purchases are flagged immediately.</li>
</ul>

<p>By compiling these data vectors, our AI calculates a single, clean reviewer trust rating so you can ignore the noise and make buying decisions with confidence.</p>`
  },
  {
    title: "The Science Behind Regret Probability Algorithms",
    slug: "science-behind-regret-probability-algorithms",
    summary: "An in-depth look at how we train sentiment analysis classifiers on returns logs and post-purchase consumer complaints to forecast buyer's remorse.",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    author: "Marcus Vance (Senior Data Scientist)",
    date: "June 25, 2026",
    readTime: "8 min read",
    category: "AI Tech",
    content: `<h3>Predicting Buyer's Remorse Before It Happens</h3>
<p>Have you ever bought a highly-rated item, only to find it collecting dust on your shelf or returned within a week? That experience is what data scientists call "remorse risk." At BuyWise, we have developed a machine learning model specifically optimized to predict this risk prior to check-out.</p>

<h3>Gathering Unstructured Return Log Semantics</h3>
<p>Traditional recommendation engines rely only on simple purchasing history. To forecast regret, we ingest thousands of post-purchase text logs from community boards, electronics warranty claims, and public refund diaries. Our models process this text to identify common buyer complaints that only manifest after weeks of usage:
<ul>
  <li>Ergonomic fatigue or poor build quality.</li>
  <li>Batteries that degrade significantly faster than specs suggest.</li>
  <li>Hidden subscription locks or complex configuration procedures.</li>
</ul>

<h3>The Regret Index (RI) Calculation</h3>
<p>The Regret Index is calculated using time-series classifiers that weigh user dissatisfaction reports against historical warranty rates. If an item scores above 40% on our Regret Index, the system flags it and suggests a highly-rated, lower-risk alternative.</p>`
  },
  {
    title: "Retail Cycles: When is the Best Time to Buy Tech?",
    slug: "retail-cycles-best-time-to-buy-tech",
    summary: "Historical analysis of electronics pricing charts shows predictable bottoms. Discover how BuyWise timing score algorithm predicts tech discount bottoms.",
    cover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    author: "Elena Rostova (Market Analyst)",
    date: "June 20, 2026",
    readTime: "6 min read",
    category: "Smart Shopping",
    content: `<h3>Understanding Electronics Retail Pricing Fluctuations</h3>
<p>Pricing is not static. Online retailers use automated repricing algorithms that fluctuate hourly based on consumer demand, inventory volume, and competitor pricing. However, long-term historical charts show predictable cyclical patterns.</p>

<h3>Predictable Tech Discount Bottoms</h3>
<p>Based on our retail catalog price history models, tech purchases follow key seasonal bottoms:</p>
<ol>
  <li><strong>Spring Cleanout (March-April)</strong>: Retailers clear inventory ahead of summer shipments. Great for previous-generation laptops.</li>
  <li><strong>Back-to-School (August)</strong>: Heavy discounting on consumer laptops, monitors, and tablets.</li>
  <li><strong>Holiday Clearance (November-December)</strong>: Peak pricing volatility. Best for smart home accessories, but watch out for synthetic price markups prior to sales.</li>
</ol>

<h3>Letting AI Watch the Price for You</h3>
<p>Instead of manually charting retail pricing, our pricing forecasting models run time-series projection charts. When a product bottom is predicted within 14 days, BuyWise triggers a price alert notification so you buy at the absolute lowest cost.</p>`
  }
];

export default function BlogPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    // Seed and load posts
    const stored = localStorage.getItem("buywise_blogs");
    if (!stored) {
      localStorage.setItem("buywise_blogs", JSON.stringify(DEFAULT_POSTS));
      setPosts(DEFAULT_POSTS);
    } else {
      setPosts(JSON.parse(stored));
    }
  }, []);

  const categories = ["All", "Guides", "AI Tech", "Smart Shopping"];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* ── HEADER NAVIGATION ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "var(--nav-bg)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "64px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, cursor: "pointer" }} onClick={() => router.push("/")}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "var(--accent)" }}>
            <path d="M12 2L22 8.5L12 15L2 8.5L12 2Z" fill="currentColor" />
            <path d="M12 15L22 8.5V15.5L12 22L2 15.5V8.5L12 15Z" fill="currentColor" opacity="0.75" />
          </svg>
          <span style={{ fontSize: 16, letterSpacing: "-0.5px" }}>BuyWise</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => router.push("/")} className="btn-ghost btn-sm">Home</button>
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
            className="btn-ghost btn-sm" 
            style={{ width: 34, height: 34, padding: 0, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text)" }}
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {user ? (
            <button onClick={() => router.push("/dashboard")} className="btn-primary btn-sm">Dashboard</button>
          ) : (
            <button onClick={() => router.push("/login")} className="btn-primary btn-sm">Sign in</button>
          )}
        </div>
      </nav>

      {/* ── HERO BANNER ── */}
      <header style={{ maxWidth: 840, margin: "0 auto", padding: "64px 24px 32px", textAlign: "center" }}>
        <div className="badge badge-teal" style={{ marginBottom: 16, textTransform: "uppercase", letterSpacing: "1px" }}>
          BuyWise Journal
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 12 }}>
          Smart Shopping, <span className="grad-text" style={{ background: "linear-gradient(135deg, var(--accent) 0%, #38bdf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Backed by AI.</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--muted)", maxWidth: 520, margin: "0 auto 28px" }}>
          In-depth guides, research, and analysis on how artificial intelligence reveals the truth behind reviews and pricing trends.
        </p>

        {/* Filters and search */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", alignItems: "center", marginTop: 24 }}>
          {/* Category buttons */}
          <div style={{ display: "flex", gap: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 100, padding: 4 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background: activeCategory === cat ? "var(--teal-dim)" : "none",
                  border: "none",
                  borderRadius: 100,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  color: activeCategory === cat ? "var(--teal)" : "var(--muted)",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 100, padding: "6px 14px", width: 220
          }}>
            <Search size={14} style={{ color: "var(--hint)" }} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: "none", background: "transparent", fontSize: 12, color: "var(--text)", width: "100%", outline: "none" }}
            />
          </div>
        </div>
      </header>

      {/* ── ARTICLES GRID ── */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>
        {filteredPosts.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                onClick={() => router.push(`/blog/${post.slug}`)}
                style={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}
              >
                <CardTilt
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 20,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  {/* Cover Photo */}
                  <div style={{ position: "relative", height: 180, width: "100%", overflow: "hidden", background: "var(--surface-sec)" }}>
                    <img
                      src={post.cover}
                      alt={post.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 100, fontSize: 10, fontWeight: 800, color: "#fff", textTransform: "uppercase" }}>
                      {post.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1, gap: 10 }}>
                    <h2 style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.3, color: "var(--text)" }}>{post.title}</h2>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, flex: 1 }}>{post.summary}</p>
                    
                    {/* Meta details */}
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "var(--hint)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <User size={12} />
                        <span style={{ fontWeight: 600 }}>{post.author.split(" ")[0]}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Calendar size={12} /> {post.date.split(",")[0]}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Clock size={12} /> {post.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardTilt>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "80px 24px", textAlign: "center", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20 }}>
            <BookOpen size={48} style={{ color: "var(--hint)", margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No articles found</h3>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Try searching for a different keyword or category.</p>
          </div>
        )}
      </main>
    </div>
  );
}
