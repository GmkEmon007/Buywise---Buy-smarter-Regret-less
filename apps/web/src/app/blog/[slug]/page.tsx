"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { BlogPost } from "../page";
import { ArrowLeft, User, Calendar, Clock, BookOpen, AlertTriangle, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function BlogPostReader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("buywise_blogs");
    if (stored) {
      const posts: BlogPost[] = JSON.parse(stored);
      const found = posts.find(p => p.slug === slug);
      if (found) {
        setPost(found);
      }
    }
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="skeleton-shimmer" style={{ width: 80, height: 80, borderRadius: "50%" }} />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
        {/* Navigation */}
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
        </nav>

        <div style={{ maxWidth: 540, margin: "100px auto 0", padding: "0 24px", textAlign: "center" }}>
          <AlertTriangle size={48} style={{ color: "var(--amber)", margin: "0 auto 20px" }} />
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Article Not Found</h1>
          <p style={{ color: "var(--muted)", marginBottom: 28 }}>The blog post you are looking for does not exist or has been deleted by an administrator.</p>
          <button onClick={() => router.push("/blog")} className="btn-primary" style={{ padding: "0 24px" }}>
            <ArrowLeft size={16} style={{ marginRight: 6 }} /> Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {/* ── NAVIGATION ── */}
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
          <button onClick={() => router.push("/blog")} className="btn-ghost btn-sm">All Articles</button>
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

      {/* ── ARTICLE CONTAINER ── */}
      <article style={{ maxWidth: 740, margin: "0 auto", padding: "48px 24px 100px" }}>
        
        {/* Back Button */}
        <button 
          onClick={() => router.push("/blog")} 
          style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--muted)", fontWeight: 700, fontSize: 13, cursor: "pointer", marginBottom: 28, transition: "color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          <ArrowLeft size={16} /> Back to articles
        </button>

        {/* Category badge */}
        <span className="badge badge-teal" style={{ marginBottom: 16, display: "inline-block", fontSize: 10, textTransform: "uppercase" }}>
          {post.category}
        </span>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(28px, 5.5vw, 42px)", fontWeight: 900, lineHeight: 1.2, letterSpacing: "-1.5px", marginBottom: 20 }}>
          {post.title}
        </h1>

        {/* Meta details */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", fontSize: 13, color: "var(--muted)", borderBottom: "1px solid var(--border)", paddingBottom: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--teal-dim)", color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11 }}>
              {post.author[0]}
            </div>
            <span style={{ fontWeight: 700, color: "var(--text)" }}>{post.author}</span>
          </div>
          <span style={{ color: "var(--border)" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Calendar size={14} /> {post.date}
          </div>
          <span style={{ color: "var(--border)" }}>|</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Clock size={14} /> {post.readTime}
          </div>
        </div>

        {/* Banner Cover image */}
        <div style={{ width: "100%", height: 360, borderRadius: 24, overflow: "hidden", border: "1px solid var(--border)", marginBottom: 36, background: "var(--surface-sec)" }}>
          <img src={post.cover} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Rich HTML content body */}
        <div 
          className="blog-post-body" 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          style={{
            fontSize: 16,
            lineHeight: 1.75,
            color: "var(--text)"
          }}
        />

        <style>{`
          .blog-post-body h2 { font-size: 22px; font-weight: 800; margin-top: 36px; margin-bottom: 12px; letter-spacing: -0.5px; }
          .blog-post-body h3 { font-size: 19px; font-weight: 800; margin-top: 28px; margin-bottom: 10px; letter-spacing: -0.5px; }
          .blog-post-body p { margin-bottom: 20px; color: var(--muted); }
          .blog-post-body ul, .blog-post-body ol { margin-left: 20px; margin-bottom: 20px; color: var(--muted); }
          .blog-post-body li { margin-bottom: 6px; }
          .blog-post-body strong { color: var(--text); }
        `}</style>
      </article>
    </div>
  );
}
