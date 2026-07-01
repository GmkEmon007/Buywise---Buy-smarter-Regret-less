"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function MagneticButton({ children, className = "", onClick, type = "button", disabled = false, style = {} }: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  
  // Motion values for button offset
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for high-end magnetic pull effect
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    
    // Distance from center of button
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Pull offsets (capped at 12px)
    const pullX = (e.clientX - centerX) * 0.35;
    const pullY = (e.clientY - centerY) * 0.35;

    x.set(Math.max(-12, Math.min(12, pullX)));
    y.set(Math.max(-12, Math.min(12, pullY)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;

    const newRipple = {
      id: Date.now(),
      x: rippleX,
      y: rippleY,
    };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      type={type}
      disabled={disabled}
      className={`btn-primary ${className}`}
      style={{
        x: springX,
        y: springY,
        position: "relative",
        ...style
      }}
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{
        scale: 0.97,
      }}
    >
      {/* Click ripple animation overlays */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          style={{
            position: "absolute",
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.4)",
            transform: "scale(1)",
            animation: "btnRipple 0.6s ease-out forwards",
            pointerEvents: "none",
          }}
        />
      ))}
      
      <style>{`
        @keyframes btnRipple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(15); opacity: 0; }
        }
      `}</style>
      
      <span style={{ position: "relative", zIndex: 1, display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
    </motion.button>
  );
}
