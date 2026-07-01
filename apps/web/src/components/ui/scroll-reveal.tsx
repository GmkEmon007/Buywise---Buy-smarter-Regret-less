"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ 
        duration: 0.65, 
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        delay: delay 
      }}
      className={className}
      style={{ willChange: "transform, opacity, filter" }}
    >
      {children}
    </motion.div>
  );
}
