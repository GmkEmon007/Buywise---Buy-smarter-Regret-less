"use client";

import { useEffect } from "react";
import { MotionConfig, AnimatePresence } from "framer-motion";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Update mouse coordinate variables on document root
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return (
    <MotionConfig transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.8 }}>
      {/* Background layers */}
      <div className="mesh-bg" />
      <div className="noise-overlay" />
      <div className="cursor-glow-interactive" />
      
      <AnimatePresence mode="wait">
        {children}
      </AnimatePresence>
    </MotionConfig>
  );
}
