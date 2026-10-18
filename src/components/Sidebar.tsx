"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  UserCheck,
  CheckSquare,
  BookOpen,
  Award,
  HelpCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { GitclubLogo } from "./GitclubLogo";
import { scrollToSection } from "./SmoothScroll";
import { logoutAction } from "@/actions/auth";
import { Profile } from "@/types/database";

interface SidebarProps {
  currentUser: Profile;
  activeSection: string;
}

export function Sidebar({ currentUser, activeSection }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const navItems = [
    { id: "explore", label: "Home", icon: Home },
    { id: "attendance", label: "Calendar", icon: Calendar },
    { id: "clubs", label: "Community", icon: Users },
    { id: "attendance", label: "My Attendance", icon: UserCheck },
    { id: "activities", label: "Approvals", icon: CheckSquare },
    { id: "clubs", label: "My Domains", icon: BookOpen },
    { id: "certificates", label: "Transcripts", icon: Award },
    { id: "overview", label: "Help & FAQs", icon: HelpCircle },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 bottom-0 z-40 bg-gradient-to-b from-[#132c69] via-[#1d4ed8] to-[#2563eb] text-white select-none border-r border-blue-400/20 shadow-2xl">
      {/* Top Logo */}
      <div className="p-6 pb-5 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <GitclubLogo size="sm" showText={true} inverted={true} />
        </Link>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
        {navItems.map((item, idx) => {
          const isActive = activeSection === item.id || (idx === 0 && (activeSection === "explore" || !activeSection));
          const Icon = item.icon;

          return (
            <button
              key={`${item.id}-${idx}`}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                isActive
                  ? "bg-white text-[#1d4ed8] shadow-md shadow-black/10 font-bold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1d4ed8]" : "text-white/80"}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6 pb-2 px-3">
          <span className="text-[10px] font-mono tracking-widest uppercase text-white/50 font-bold">
            SETTINGS
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition text-left"
        >
          <LogOut className="w-4 h-4 shrink-0 text-white/70" />
          <span>Log Out</span>
        </button>
      </nav>

      {/* User Profile Card at Bottom (Matching Screenshot) */}
      <div className="p-4 border-t border-white/10 bg-black/15 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                {currentUser.fullName.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate leading-tight">
              {currentUser.fullName}
            </span>
            <span className="text-[10px] text-blue-200/90 font-mono uppercase tracking-wide truncate mt-0.5">
              {currentUser.title || "BTECH • MIRAI"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
