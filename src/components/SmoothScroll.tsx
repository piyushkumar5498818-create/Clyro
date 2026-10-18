"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";

interface SmoothScrollContextType {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => void;
  scrollProgress: number;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  lenis: null,
  scrollTo: () => {},
  scrollProgress: 0,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function scrollToSection(sectionId: string, offset: number = -80) {
  const cleanId = sectionId.startsWith("#") ? sectionId.slice(1) : sectionId;
  const target = document.getElementById(cleanId);
  if (!target) return;

  const lenisInstance = (window as any).__gitclub_lenis as Lenis | undefined;
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
  } else {
    const yOffset = offset;
    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Initialize Lenis smooth scroll engine (Studio Freight / darkroom.engineering)
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });

    (window as any).__gitclub_lenis = lenis;
    setLenisInstance(lenis);

    lenis.on("scroll", (e: any) => {
      if (e.progress !== undefined) {
        setScrollProgress(e.progress);
      } else {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / totalHeight)) : 0;
        setScrollProgress(progress);
      }
    });

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      (window as any).__gitclub_lenis = null;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (lenisInstance) {
      lenisInstance.scrollTo(target, {
        offset: options?.offset ?? -80,
        duration: options?.duration ?? 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else if (typeof target === "string") {
      scrollToSection(target, options?.offset ?? -80);
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisInstance, scrollTo, scrollProgress }}>
      {/* Top Hairline Scroll Progress Bar (Lenis.dev aesthetic) */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 origin-left transition-transform duration-75"
        style={{
          transform: `scaleX(${scrollProgress})`,
        }}
      />
      {children}
    </SmoothScrollContext.Provider>
  );
}
