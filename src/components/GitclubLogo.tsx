"use client";

import React from "react";

interface GitclubLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  inverted?: boolean;
}

export function GitclubLogo({
  className = "",
  size = "md",
  showText = true,
  inverted = false,
}: GitclubLogoProps) {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  }[size];

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Dynamic Geometric Gitclub Logo with 4-dot Mirai Constellation & Git Nexus */}
      <div
        className={`${iconDimensions} relative flex items-center justify-center rounded-2xl shadow-md transition-transform duration-300 hover:scale-105 ${
          inverted
            ? "bg-white text-blue-700 shadow-blue-900/30"
            : "bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 text-white shadow-blue-600/30"
        } p-2`}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Mirai 4-dot constellation in M pattern */}
          <circle cx="7" cy="10" r="2.6" fill={inverted ? "#1d4ed8" : "#ffffff"} />
          <circle cx="16" cy="7" r="2.6" fill={inverted ? "#06b6d4" : "#67e8f9"} />
          <circle cx="25" cy="10" r="2.6" fill={inverted ? "#1d4ed8" : "#ffffff"} />
          <circle cx="16" cy="16" r="2.8" fill={inverted ? "#2563eb" : "#e0e7ff"} />

          {/* Git Branch Nexus paths linking constellation to base */}
          <path
            d="M7 13V22C7 23.6569 8.34315 25 10 25H22C23.6569 25 25 23.6569 25 22V13"
            stroke={inverted ? "#1d4ed8" : "#ffffff"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.8"
          />
          <path
            d="M16 19V25"
            stroke={inverted ? "#06b6d4" : "#67e8f9"}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Base Anchor Node */}
          <circle cx="16" cy="25" r="2.2" fill={inverted ? "#1e40af" : "#ffffff"} />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight ${textSizes} ${
                inverted
                  ? "text-white"
                  : "text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200"
              }`}
            >
              Gitclub
            </span>
            <span
              className={`text-[9px] font-mono uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full ${
                inverted
                  ? "bg-white/20 text-cyan-200"
                  : "bg-blue-500/20 text-cyan-400 border border-blue-400/30"
              }`}
            >
              MIRAI
            </span>
          </div>
          <span
            className={`text-[10px] tracking-wider font-semibold uppercase ${
              inverted ? "text-blue-100/80" : "text-blue-300/80"
            }`}
          >
            Club Operations Hub
          </span>
        </div>
      )}
    </div>
  );
}
