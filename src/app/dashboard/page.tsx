"use client";

import { useState, useEffect } from "react";
import {
  Profile,
  Organization,
  Activity,
  Submission,
  Certificate,
  OrganizationMembership,
} from "@/types/database";
import {
  getCurrentUserAction,
  getAllProfilesAction,
  switchUserAction,
} from "@/actions/auth";
import {
  getAllOrganizationsAction,
  getInstitutionalMetricsAction,
} from "@/actions/organizations";
import { getActivitiesAction } from "@/actions/activities";
import { getSubmissionsAction } from "@/actions/submissions";
import { getCertificatesAction } from "@/actions/certificates";
import {
  getMyMembershipsAction,
  getClubMembershipsAction,
} from "@/actions/memberships";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { ExploreSection } from "@/components/ExploreSection";
import { OverviewView } from "@/components/OverviewView";
import { ClubsHierarchyView } from "@/components/ClubsHierarchyView";
import { ActivityManagementView } from "@/components/ActivityManagementView";
import { AttendanceView } from "@/components/AttendanceView";
import { SubmissionsView } from "@/components/SubmissionsView";
import { CertificatesView } from "@/components/CertificatesView";
import { GitclubLogo } from "@/components/GitclubLogo";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeSection, setActiveSection] = useState("explore");

  // Data states
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [institutionalMetrics, setInstitutionalMetrics] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myMemberships, setMyMemberships] = useState<OrganizationMembership[]>([]);
  const [allMemberships, setAllMemberships] = useState<OrganizationMembership[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [
        user,
        profs,
        orgs,
        instMet,
        acts,
        myMems,
        subs,
        certs,
      ] = await Promise.all([
        getCurrentUserAction(),
        getAllProfilesAction(),
        getAllOrganizationsAction(),
        getInstitutionalMetricsAction(),
        getActivitiesAction(),
        getMyMembershipsAction(),
        getSubmissionsAction(),
        getCertificatesAction(),
      ]);

      setCurrentUser(user);
      setProfiles(profs);
      setOrganizations(orgs);
      setInstitutionalMetrics(instMet);
      setActivities(acts);
      setMyMemberships(myMems);
      setSubmissions(subs);
      setCertificates(certs);

      if (orgs.length > 0) {
        const memPromises = orgs.map((o) => getClubMembershipsAction(o.id));
        const nestedMems = await Promise.all(memPromises);
        setAllMemberships(nestedMems.flat());
      }
    } catch (err) {
      console.error("Failed to load Gitclub dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Track active section for Lenis smooth scroll indicators
  useEffect(() => {
    const sectionIds = [
      "explore",
      "overview",
      "clubs",
      "attendance",
      "activities",
      "submissions",
      "certificates",
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleSwitchUser = async (userId: string) => {
    setLoading(true);
    await switchUserAction(userId);
    await loadAllData();
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#070b16]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center max-w-sm shadow-2xl border border-white/10"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Loader2 className="w-7 h-7 text-cyan-400 animate-spin" />
          </div>
          <div className="text-base font-bold text-white tracking-tight">
            Loading Gitclub...
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            MIRAI CAMPUS OPERATIONS
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Royal Cobalt Sidebar (Matching user's uploaded reference image) */}
      <Sidebar currentUser={currentUser} activeSection={activeSection} />

      {/* Main Single Scrollable Canvas */}
      <div className="flex-1 min-w-0 lg:pl-64 flex flex-col">
        {/* Sticky Top HUD Navigation & Persona Switcher */}
        <Navbar
          currentUser={currentUser}
          profiles={profiles}
          onSwitchUser={handleSwitchUser}
          activeSection={activeSection}
        />

        {/* Continuous Single Page Flow (Inspired by lenis.dev smooth scroll) */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
          {/* Section 00: Explore / Live Curriculum / Radial 97% Attendance Ring / Highlights */}
          <ExploreSection currentUser={currentUser} activities={activities} />

          {/* Section 01: [01] / OVERVIEW & CAMPUS PULSE */}
          <section id="overview" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-blue-400 tracking-widest">
                [01]
              </span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Overview & Institutional Metrics
              </span>
              <span className="text-[10px] text-slate-500 font-normal ml-auto hidden sm:inline">
                NON-DOUBLE-COUNTED CAMPUS AGGREGATION
              </span>
            </div>
            <OverviewView
              currentUser={currentUser}
              organizations={organizations}
              institutionalMetrics={institutionalMetrics}
              activities={activities}
              attendanceRecords={[]}
              submissions={submissions}
              certificates={certificates}
            />
          </section>

          {/* Section 02: [02] / CLUBS, DOMAINS & INITIATIVES */}
          <section id="clubs" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-blue-400 tracking-widest">
                [02]
              </span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Student Organizations & Specialized Units
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold ml-auto hidden sm:inline">
                KAIZEN (3 TECH DOMAINS) &bull; NEX-CELL (6 TRACKS) &bull; MALHAR (5 DEPTS)
              </span>
            </div>
            <ClubsHierarchyView
              currentUser={currentUser}
              topClubs={organizations}
              societySubClubs={[]}
              myMemberships={myMemberships}
              allMemberships={allMemberships}
              onRefresh={loadAllData}
            />
          </section>

          {/* Section 03: [03] / LIVE SESSIONS & ATTENDANCE CHECK-IN */}
          <section id="attendance" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-blue-400 tracking-widest">
                [03]
              </span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Live Sessions & Smart Anti-Fraud Attendance
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold ml-auto hidden sm:inline">
                DYNAMIC 60-MIN TOTP CHECK-IN
              </span>
            </div>
            <AttendanceView
              currentUser={currentUser}
              activities={activities}
              onRefresh={loadAllData}
            />
          </section>

          {/* Section 04: [04] / ACTIVITY PROPOSALS & LEADERSHIP APPROVALS */}
          <section id="activities" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-blue-400 tracking-widest">
                [04]
              </span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Activity Proposals & Student Leadership Governance
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold ml-auto hidden sm:inline">
                PRESIDENT & VP EXECUTIVE APPROVAL DESK
              </span>
            </div>
            <ActivityManagementView
              currentUser={currentUser}
              clubs={organizations as any}
              activities={activities}
              onRefresh={loadAllData}
            />
          </section>

          {/* Section 05: [05] / DELIVERABLES & MULTI-CRITERIA RUBRICS */}
          <section id="submissions" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-blue-400 tracking-widest">
                [05]
              </span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Deliverables & Rubric Evaluation Engine
              </span>
              <span className="text-[10px] text-purple-400 font-semibold ml-auto hidden sm:inline">
                100-POINT MULTI-CRITERIA SCORING
              </span>
            </div>
            <SubmissionsView
              currentUser={currentUser}
              activities={activities}
              submissions={submissions}
              onRefresh={loadAllData}
            />
          </section>

          {/* Section 06: [06] / VERIFIED TRANSCRIPTS & CERTIFICATES */}
          <section id="certificates" className="scroll-mt-24 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-xs font-bold text-blue-400 tracking-widest">
                [06]
              </span>
              <span className="text-xs font-bold text-white tracking-widest uppercase">
                Verified Transcripts & Cryptographic Credentials
              </span>
              <span className="text-[10px] text-amber-400 font-semibold ml-auto hidden sm:inline">
                PUBLIC VERIFICATION LEDGER (/VERIFY)
              </span>
            </div>
            <CertificatesView
              currentUser={currentUser}
              clubs={organizations as any}
              certificates={certificates}
              onRefresh={loadAllData}
            />
          </section>
        </main>

        {/* Refined Monospace Minimalist Footer */}
        <footer className="border-t border-white/10 bg-[#070b16]/80 backdrop-blur-2xl py-8 text-xs text-slate-400 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GitclubLogo size="sm" showText={true} />
            </div>
            <div className="flex flex-col sm:items-end text-center sm:text-right font-mono text-[11px] text-slate-400 space-y-0.5">
              <span>&copy; {new Date().getFullYear()} Gitclub &bull; Mirai School of Technology</span>
              <span className="text-slate-500">
                NEX-CELL &middot; Kaizen Tech (CP, Web, AI/DS) &middot; MALHAR &middot; Verified Ledger
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
