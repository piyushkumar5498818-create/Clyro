"use client";

import React from "react";
import { motion } from "framer-motion";

export type AnimationVariant = "pop" | "depth" | "slide" | "zoom";

interface ScrollFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  variant?: AnimationVariant;
  scaleStart?: number;
  once?: boolean;
  amount?: number | "some" | "all";
}

/**
 * ScrollFadeIn: High-performance, hardware-accelerated 3D scroll entrance.
 * Uses composite-only properties (transform & opacity) with will-change to
 * maintain buttery 120 FPS performance even during high-velocity scrolling.
 */
export function ScrollFadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 28,
  variant = "pop",
  scaleStart = 0.94,
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
        };
      case "zoom":
        return {
          opacity: 0,
          scale: 0.88,
          y: 0,
        };
      case "slide":
      default:
        return {
          opacity: 0,
          ...offset,
          scale: 1,
        };
    }
  };

  const getAnimate = () => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
  });

  return (
    <motion.div
      initial={getInitial()}
      whileInView={getAnimate()}
      viewport={{ once, margin: "-50px", amount }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 18,
        mass: 0.75,
        delay,
      }}
      style={{
        transformPerspective: 1200,
        willChange: "transform, opacity",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * PopCard: Interactive card that animates on scroll and lifts on hover.
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
      initial={{ opacity: 0, scale: 0.93, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once, margin: "-40px", amount: 0.1 }}
      whileHover={
        hoverPop
          ? {
              scale: 1.025,
              y: -4,
              transition: { type: "spring", stiffness: 450, damping: 22 },
            }
          : undefined
      }
      whileTap={hoverPop ? { scale: 0.98 } : undefined}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 18,
        mass: 0.75,
        delay,
      }}
      style={{
        transformPerspective: 1000,
        willChange: "transform, opacity",
      }}
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
  staggerDelay = 0.06,
  once = false,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px", amount: 0.1 }}
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
        hidden: { opacity: 0, scale: 0.93, y: 20 },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 90,
            damping: 18,
            mass: 0.75,
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
      style={{
        transformPerspective: 1000,
        willChange: "transform, opacity",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
