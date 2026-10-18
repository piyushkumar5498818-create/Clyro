"use client";

import React from "react";

interface ScrollFadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  variant?: string;
  scaleStart?: number;
  once?: boolean;
  amount?: number | "some" | "all";
}

/**
 * Clean, instant block container without scroll-triggered opacity/scale fading.
 * Ensures the screen remains solid, responsive, and completely frictionless while scrolling.
 */
export function ScrollFadeIn({
  children,
  className = "",
}: ScrollFadeInProps) {
  return <div className={className}>{children}</div>;
}

export function PopCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverPop?: boolean;
  once?: boolean;
}) {
  return (
    <div className={`transition-all duration-200 hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
  hoverPop?: boolean;
}) {
  return (
    <div className={`transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
}
