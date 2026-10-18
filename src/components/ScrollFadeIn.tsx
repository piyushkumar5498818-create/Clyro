"use client";

import React from "react";
import { motion } from "framer-motion";

export type AnimationVariant = "pop" | "depth" | "slide" | "zoom" | "flipUp";

interface ScrollFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  variant?: AnimationVariant;
  scaleStart?: number;
  blur?: boolean;
  once?: boolean;
  amount?: number | "some" | "all";
}

/**
 * ScrollFadeIn provides repeatable 3D perspective scroll entrances:
 * Animates on scroll continuously throughout the user session (once: false).
 * Elements pop forward from z-axis background into crisp focus whenever
 * scrolled into view, from either direction.
 */
export function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 36,
  variant = "pop",
  scaleStart = 0.9,
  blur = true,
  once = false,
  amount = 0.12,
}: ScrollFadeInProps) {
  const getOffset = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const offset = getOffset();

  const getInitial = () => {
    switch (variant) {
      case "pop":
      case "depth":
        return {
          opacity: 0,
          scale: scaleStart,
          y: distance,
          rotateX: 3,
          filter: blur ? "blur(8px)" : "blur(0px)",
        };
      case "zoom":
        return {
          opacity: 0,
          scale: 0.85,
          y: 0,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };
      case "flipUp":
        return {
          opacity: 0,
          scale: 0.9,
          rotateX: 14,
          y: 36,
          filter: blur ? "blur(6px)" : "blur(0px)",
        };
      case "slide":
      default:
        return {
          opacity: 0,
          ...offset,
          scale: 1,
          rotateX: 0,
          filter: "blur(0px)",
        };
    }
  };

  const getAnimate = () => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
  });

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, margin: "-50px", amount }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 16,
        mass: 0.8,
        delay,
      }}
      style={{
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * PopCard provides an interactive card component that pops in from the back
 * on viewport scroll (active throughout the session) and dynamically lifts on hover.
 */
export function PopCard({
  children,
  className = "",
  delay = 0,
  hoverPop = true,
  once = false,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverPop?: boolean;
  once?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 22, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-40px", amount: 0.1 }}
      whileHover={
        hoverPop
          ? {
              scale: 1.025,
              y: -5,
              transition: { type: "spring", stiffness: 450, damping: 20 },
            }
          : undefined
      }
      whileTap={hoverPop ? { scale: 0.98 } : undefined}
      transition={{
        type: "spring",
        stiffness: 85,
        damping: 16,
        mass: 0.8,
        delay,
      }}
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  once = false,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px", amount: 0.1 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  hoverPop = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverPop?: boolean;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.9, y: 24, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            type: "spring",
            stiffness: 85,
            damping: 16,
            mass: 0.8,
          },
        },
      }}
      whileHover={
        hoverPop
          ? {
              scale: 1.025,
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 20 },
            }
          : undefined
      }
      style={{ transformPerspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
