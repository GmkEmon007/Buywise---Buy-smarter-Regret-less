"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, KeyRound, Chrome, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(""); 
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (!ok) { 
      setError("Invalid email or password."); 
    }
  }

  function fillDemo(role: "user" | "admin") {
    setEmail(role === "admin" ? "admin@demo.com" : "user@demo.com");
    setPassword(role === "admin" ? "admin123" : "user123");
    setError("");
    setShowDemoMenu(false);
  }

  // Animation variants for staggered load
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 24 }
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: 24 }}>
      
      {/* ── BACKGROUND ORBS (Ambient Glows) ── */}
      <div className="orb orb-teal" style={{ width: 600, height: 600, top: "-150px", left: "-150px", opacity: 0.25 }} />
      <div className="orb orb-purple" style={{ width: 500, height: 500, bottom: "-100px", right: "-100px", opacity: 0.2 }} />

      {/* ── FLOATING DEMO CONTROLLER (Ultra-Sleek) ── */}
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 100 }}>
        <button 
          onClick={() => setShowDemoMenu(!showDemoMenu)}
          style={{ 
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--surface)", border: "1.5px solid var(--border)",
            color: "var(--text)", padding: "10px 18px", borderRadius: 100,
            fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "var(--shadow-soft)", transition: "all 0.2s"
          }}
          className="demo-menu-btn"
        >
          <KeyRound size={14} className="text-teal" />
          Quick Demo Accounts
        </button>

        <AnimatePresence>
          {showDemoMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                position: "absolute", right: 0, marginTop: 8, width: 220,
                background: "var(--surface)", border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-md)", padding: 12, boxShadow: "var(--shadow-premium)",
                zIndex: 100, backdropFilter: "blur(20px)"
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 800, color: "var(--hint)", textTransform: "uppercase", marginBottom: 8, letterSpacing: "0.5px" }}>Select Profile</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button 
                  onClick={() => fillDemo("user")}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: "var(--bg-sec)", color: "var(--text)", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", textAlign: "left" }}
                >
                  👤 Standard User
                </button>
                <button 
                  onClick={() => fillDemo("admin")}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", border: "none", background: "var(--bg-sec)", color: "var(--text)", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%", textAlign: "left" }}
                >
                  🛡 Administrator
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CARD LOGIN PANEL ── */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass noise"
        style={{ width: "100%", maxWidth: 460, padding: "48px 40px", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-premium)", position: "relative", zIndex: 10 }}
      >
        {/* Brand Header */}
        <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 36 }}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#9EE55B] to-[#8cd147] flex items-center justify-center shadow-md mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950">
              <path d="M12 2L22 8.5L12 15L2 8.5L12 2Z" fill="currentColor" />
              <path d="M12 15L22 8.5V15.5L12 22L2 15.5V8.5L12 15Z" fill="currentColor" opacity="0.75" />
            </svg>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ fontSize: 15, color: "var(--muted)", fontWeight: 500 }}>Log in to access your purchase insights</p>
        </motion.div>

        {/* Error Notice */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden", marginBottom: 18 }}
            >
              <div style={{ background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "var(--radius-sm)", padding: "12px 14px", fontSize: 13, color: "var(--red)", display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                <AlertCircle size={16} /> {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Fields */}
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          <motion.div variants={itemVariants} style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--hint)" }}>
              <Mail size={16} />
            </span>
            <input 
              className="input" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="name@company.com" 
              style={{ paddingLeft: 46, fontSize: 14, height: 48, borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)" }}
              required 
              autoComplete="email" 
            />
          </motion.div>

          <motion.div variants={itemVariants} style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--hint)" }}>
              <Lock size={16} />
            </span>
            <input 
              className="input" 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="Password" 
              style={{ paddingLeft: 46, fontSize: 14, height: 48, borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)" }}
              required 
              autoComplete="current-password" 
            />
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: "flex", justifyContent: "flex-end", fontSize: 13 }}>
            <a href="#" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>Forgot Password?</a>
          </motion.div>

          {/* Action button */}
          <motion.div variants={itemVariants} style={{ marginTop: 8 }}>
            <MagneticButton 
              type="submit" 
              style={{ width: "100%", height: 48, fontSize: 14, borderRadius: "var(--radius-sm)", fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? "Verifying credentials..." : "Continue"} <ArrowRight size={14} />
            </MagneticButton>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div 
          variants={itemVariants}
          style={{ display: "flex", alignItems: "center", margin: "28px 0", gap: 12 }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 11, color: "var(--hint)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>or</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </motion.div>

        {/* Social Authentication */}
        <motion.div variants={itemVariants} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button 
            className="social-btn" 
            onClick={() => fillDemo("user")}
            style={{ 
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", height: 46, borderRadius: "var(--radius-sm)",
              border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)",
              fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <Chrome size={16} /> Continue with Google
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "var(--muted)", fontWeight: 600 }}
        >
          Don't have an account? <Link href="/register" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>Sign up free</Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
