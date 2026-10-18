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
}

/**
 * ScrollFadeIn provides cinematic 3D perspective scroll entrances:
 * "pop" / "depth" (default): fades in from deep in the z-axis background,
 * scaling from 0.88 -> 1.0 with a soft blur-to-sharp focus transition
 * and spring dynamics that physically "pops out" towards the viewer.
 */
export function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 36,
  variant = "pop",
  scaleStart = 0.88,
  blur = true,
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
          rotateX: 4,
          filter: blur ? "blur(8px)" : "blur(0px)",
        };
      case "zoom":
        return {
          opacity: 0,
          scale: 0.82,
          y: 0,
          filter: blur ? "blur(10px)" : "blur(0px)",
        };
      case "flipUp":
        return {
          opacity: 0,
          scale: 0.9,
          rotateX: 18,
          y: 40,
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
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        type: "spring",
        stiffness: 75,
        damping: 15,
        mass: 0.85,
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
 * on viewport scroll, and dynamically lifts / pops forward on hover.
 */
export function PopCard({
  children,
  className = "",
  delay = 0,
  hoverPop = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverPop?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 24, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
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
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
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
        hidden: { opacity: 0, scale: 0.88, y: 26, filter: "blur(4px)" },
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
