"use client";

import React, { useState, useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

/**
 * Global smooth scroll trigger using Lenis instance.
 * Smoothly navigates to target section with offset for sticky headers.
 */
export function scrollToSection(sectionId: string, offset: number = -85) {
  const cleanId = sectionId.startsWith("#") ? sectionId.slice(1) : sectionId;
  const target = document.getElementById(cleanId);
  if (!target) return;

  const lenis = (window as any).__gitclub_lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(target, {
      offset,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const y = target.getBoundingClientRect().top + window.pageYOffset + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

/**
 * Top Hairline Scroll Progress Bar (Lenis.dev aesthetic)
 */
function LenisProgressBar() {
  const [progress, setProgress] = useState(0);

  useLenis((lenis) => {
    (window as any).__gitclub_lenis = lenis;
    if (lenis && typeof lenis.progress === "number") {
      setProgress(lenis.progress);
    }
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 origin-left transition-transform duration-75"
      style={{ transform: `scaleX(${progress})` }}
      aria-hidden="true"
    />
  );
}

/**
 * Root SmoothScrollProvider using official darkroom.engineering ReactLenis wrapper.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.8,
      }}
    >
      <LenisProgressBar />
      {children}
    </ReactLenis>
  );
}
