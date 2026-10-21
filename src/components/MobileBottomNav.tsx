"use client";

import React from "react";
import {
  LayoutDashboard,
  Building2,
  QrCode,
  Sparkles,
  Award,
} from "lucide-react";
import { scrollToSection } from "./SmoothScroll";
import { motion } from "framer-motion";

interface MobileBottomNavProps {
  activeSection: string;
}

const NAV_TABS = [
  { id: "overview", label: "Overview", tag: "01", icon: LayoutDashboard },
  { id: "clubs", label: "Clubs", tag: "02", icon: Building2 },
  { id: "attendance", label: "Check-In", tag: "03", icon: QrCode, isCenter: true },
  { id: "activities", label: "Events", tag: "04", icon: Sparkles },
  { id: "certificates", label: "Ledger", tag: "06", icon: Award },
];

export function MobileBottomNav({ activeSection }: MobileBottomNavProps) {
  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 pointer-events-auto"
    >
      {/* Background with ultra glassmorphism & safe area */}
      <div className="bg-[#070b16]/92 backdrop-blur-2xl border-t border-white/10 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] pb-[env(safe-area-inset-bottom)]">
        <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
          {NAV_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;

            if (tab.isCenter) {
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className="relative -top-2 flex flex-col items-center group focus:outline-none"
                  aria-label={tab.label}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/40 scale-105 ring-2 ring-cyan-400/50"
                        : "bg-gradient-to-tr from-blue-700 to-indigo-700 text-cyan-200 shadow-blue-900/50 group-hover:scale-105 border border-white/20"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                      isActive ? "text-cyan-300" : "text-slate-400"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className="flex-1 py-1 flex flex-col items-center justify-center relative group focus:outline-none transition-all active:scale-95"
                aria-label={tab.label}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -top-1 w-6 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}

                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive
                      ? "text-cyan-300"
                      : "text-slate-400 group-hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <span
                  className={`text-[10px] font-semibold tracking-tight transition-colors ${
                    isActive ? "text-cyan-300 font-bold" : "text-slate-400"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
