"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface CardTiltProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function CardTilt({ children, className = "", style = {} }: CardTiltProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for tilt angles
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs for smooth movement
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 });

  // Motion values for spotlight glow location
  const spotlightX = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const spotlightY = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });

  // Spotlight coordinates transforms at top level
  const spotlightLeft = useTransform(spotlightX, (val) => val - 90);
  const spotlightTop = useTransform(spotlightY, (val) => val - 90);

  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Relative coordinates [0, 1]
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;

    x.set(relativeX - 0.5);
    y.set(relativeY - 0.5);

    // Glow position inside card
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={`glass interactive-card ${className}`}
      style={{
        ...style,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        y: -8,
        scale: 1.015,
        borderColor: "var(--accent)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 22, mass: 0.8 }}
    >
      {/* Moving cursor spotlight inside card */}
      {hovered && (
        <motion.div
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
            pointerEvents: "none",
            left: spotlightLeft,
            top: spotlightTop,
            zIndex: 0,
            mixBlendMode: "screen",
          }}
        />
      )}
      
      <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}
