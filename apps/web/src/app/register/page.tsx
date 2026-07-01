"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Mail, Lock, User as UserIcon, ShieldCheck, ArrowRight, Chrome, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "@/components/ui/magnetic-button";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Simulate user creation and log in
    await new Promise((r) => setTimeout(r, 1000));
    const ok = await login("user@demo.com", "user123");
    setLoading(false);
    if (ok) {
      router.push("/dashboard");
    } else {
      setError("Registration failed. Please try again.");
    }
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
      
      {/* ── BACKGROUND ORBS ── */}
      <div className="orb orb-teal" style={{ width: 600, height: 600, top: "-150px", left: "-150px", opacity: 0.25 }} />
      <div className="orb orb-purple" style={{ width: 500, height: 500, bottom: "-100px", right: "-100px", opacity: 0.2 }} />

      {/* ── CARD REGISTER PANEL ── */}
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
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1.5px", color: "var(--text)", marginBottom: 6 }}>Create Account</h1>
          <p style={{ fontSize: 15, color: "var(--muted)", fontWeight: 500 }}>Start making smarter purchase decisions</p>
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
              <UserIcon size={16} />
            </span>
            <input 
              className="input" 
              type="text" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)}
              placeholder="Full Name" 
              style={{ paddingLeft: 46, fontSize: 14, height: 48, borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)" }}
              required 
            />
          </motion.div>

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
              placeholder="Create strong password" 
              style={{ paddingLeft: 46, fontSize: 14, height: 48, borderRadius: "var(--radius-sm)", border: "1.5px solid var(--border)" }}
              required 
              autoComplete="new-password" 
            />
          </motion.div>

          {/* Action button */}
          <motion.div variants={itemVariants} style={{ marginTop: 12 }}>
            <MagneticButton 
              type="submit" 
              style={{ width: "100%", height: 48, fontSize: 14, borderRadius: "var(--radius-sm)", fontWeight: 700 }}
              disabled={loading}
            >
              {loading ? "Creating account..." : "Sign Up"} <ArrowRight size={14} />
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
        <motion.div variants={itemVariants} style={{ display: "flex", gap: 12 }}>
          <button 
            className="social-btn" 
            onClick={() => onSubmit(new Event("submit") as any)}
            style={{ 
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              flex: 1, height: 46, borderRadius: "var(--radius-sm)",
              border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)",
              fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s"
            }}
          >
            <Chrome size={16} /> Google
          </button>
        </motion.div>

        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          style={{ marginTop: 32, textAlign: "center", fontSize: 13, color: "var(--muted)", fontWeight: 600 }}
        >
          Already have an account? <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 700 }}>Log in</Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
