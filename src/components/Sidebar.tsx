"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  QrCode,
  CheckSquare,
  FileSpreadsheet,
  Award,
  ShieldCheck,
  LogOut,
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
  const handleLogout = async () => {
    await logoutAction();
    window.location.href = "/login";
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "clubs", label: "Clubs & Units", icon: Users },
    { id: "attendance", label: "Sessions & QR", icon: QrCode },
    { id: "activities", label: "Activity Approvals", icon: CheckSquare },
    { id: "submissions", label: "Submissions & Rubrics", icon: FileSpreadsheet },
    { id: "certificates", label: "Transcripts & Certs", icon: Award },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col fixed left-0 top-0 bottom-0 z-40 bg-gradient-to-b from-[#132c69] via-[#1d4ed8] to-[#2563eb] text-white select-none border-r border-blue-400/20 shadow-2xl">
      {/* Top Brand Logo */}
      <div className="p-6 pb-5 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 group">
          <GitclubLogo size="sm" showText={true} inverted={true} />
        </Link>
      </div>

      {/* Navigation List - Strictly Club Operations */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-200/60 font-bold">
            CLUB MANAGEMENT
          </span>
        </div>

        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left ${
                isActive
                  ? "bg-white text-[#1d4ed8] shadow-md shadow-black/15 font-bold"
                  : "text-white/85 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#1d4ed8]" : "text-white/85"}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}

        <div className="pt-6 pb-2 px-3">
          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-200/60 font-bold">
            SERVICES & SECURITY
          </span>
        </div>

        <Link
          href="/verify"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/85 hover:text-white hover:bg-white/10 transition text-left"
        >
          <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-200" />
          <span>Public Ledger</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white/85 hover:text-white hover:bg-white/10 transition text-left"
        >
          <LogOut className="w-4 h-4 shrink-0 text-rose-300" />
          <span>Log Out</span>
        </button>
      </nav>

      {/* User Profile Card at Bottom */}
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
              {currentUser.title || currentUser.role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
