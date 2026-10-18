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
import { OverviewView } from "@/components/OverviewView";
import { ClubsHierarchyView } from "@/components/ClubsHierarchyView";
import { ActivityManagementView } from "@/components/ActivityManagementView";
import { AttendanceView } from "@/components/AttendanceView";
import { SubmissionsView } from "@/components/SubmissionsView";
import { CertificatesView } from "@/components/CertificatesView";
import { GitclubLogo } from "@/components/GitclubLogo";
import { scrollToSection } from "@/components/SmoothScroll";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import {
  Users,
  QrCode,
  Award,
  Loader2,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeSection, setActiveSection] = useState("overview");

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
      "overview",
      "clubs",
      "attendance",
      "activities",
      "submissions",
      "certificates",
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
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
          <div className="text-lg font-bold text-white tracking-tight">
            Loading Gitclub...
          </div>
          <p className="text-sm text-slate-400 font-mono mt-1">
            CAMPUS OPERATIONS MATRIX
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Ribbon Header with Hidden Right Drawer Prompt Button */}
      <Navbar
        currentUser={currentUser}
        profiles={profiles}
        onSwitchUser={handleSwitchUser}
        activeSection={activeSection}
      />

      {/* Main Single Scrollable Canvas (Full Width & Spacious, Unicorn Studio aesthetic) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-24">
        {/* Quick Club Operations Ribbon Bar */}
        <ScrollFadeIn direction="down" distance={18}>
          <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-blue-950/40 via-slate-900/40 to-indigo-950/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-cyan-300 uppercase tracking-widest">
                  CAMPUS CLUBS OPERATIONS HUB
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Gitclub &bull; <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Co-Curricular Matrix</span>
              </h1>
              <p className="text-sm text-slate-300 max-w-2xl font-medium">
                Unified workspace for NEX-CELL (6 Tracks), Kaizen Tech (CP, Web, AI &amp; Data Science), and MALHAR (5 Cultural Depts).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => scrollToSection("clubs")}
                className="px-4 py-2.5 rounded-2xl bg-blue-600/20 hover:bg-blue-600/30 text-cyan-300 border border-blue-400/30 text-xs font-bold transition flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                <span>3 Clubs &amp; 8 Units</span>
              </button>
              <button
                onClick={() => scrollToSection("attendance")}
                className="px-4 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-400/30 text-xs font-bold transition flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Live QR Check-In</span>
              </button>
              <button
                onClick={() => scrollToSection("certificates")}
                className="px-4 py-2.5 rounded-2xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-400/30 text-xs font-bold transition flex items-center gap-2"
              >
                <Award className="w-4 h-4" />
                <span>Transcripts Ledger</span>
              </button>
            </div>
          </div>
        </ScrollFadeIn>

        {/* Section 01: [01] / OVERVIEW & CAMPUS CLUBS METRICS */}
        <ScrollFadeIn direction="up">
          <section id="overview" className="scroll-mt-28 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-sm font-black text-cyan-400 tracking-wider">
                [01]
              </span>
              <span className="text-sm font-bold text-white tracking-widest uppercase">
                Overview &amp; Non-Double-Counted Metrics
              </span>
              <span className="text-xs text-slate-400 font-medium ml-auto hidden sm:inline">
                VERIFIED CAMPUS REPOSITORY
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
        </ScrollFadeIn>

        {/* Section 02: [02] / CLUBS, DOMAINS & MEMBER SECTION */}
        <ScrollFadeIn direction="up">
          <section id="clubs" className="scroll-mt-28 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-sm font-black text-cyan-400 tracking-wider">
                [02]
              </span>
              <span className="text-sm font-bold text-white tracking-widest uppercase">
                Student Organizations &amp; Specialized Units
              </span>
              <span className="text-xs text-cyan-300 font-semibold ml-auto hidden sm:inline">
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
        </ScrollFadeIn>

        {/* Section 03: [03] / LIVE SESSIONS & SMART ATTENDANCE */}
        <ScrollFadeIn direction="up">
          <section id="attendance" className="scroll-mt-28 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-sm font-black text-cyan-400 tracking-wider">
                [03]
              </span>
              <span className="text-sm font-bold text-white tracking-widest uppercase">
                Club Sessions &amp; Anti-Fraud Dynamic Attendance
              </span>
              <span className="text-xs text-emerald-400 font-semibold ml-auto hidden sm:inline">
                DYNAMIC 60-MIN TOTP &amp; QR CHECK-IN
              </span>
            </div>
            <AttendanceView
              currentUser={currentUser}
              activities={activities}
              onRefresh={loadAllData}
            />
          </section>
        </ScrollFadeIn>

        {/* Section 04: [04] / ACTIVITY PROPOSALS & LEADERSHIP APPROVALS */}
        <ScrollFadeIn direction="up">
          <section id="activities" className="scroll-mt-28 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-sm font-black text-cyan-400 tracking-wider">
                [04]
              </span>
              <span className="text-sm font-bold text-white tracking-widest uppercase">
                Activity Proposals &amp; Student Leadership Governance
              </span>
              <span className="text-xs text-blue-300 font-semibold ml-auto hidden sm:inline">
                PRESIDENT &amp; VP EXECUTIVE APPROVAL DESK
              </span>
            </div>
            <ActivityManagementView
              currentUser={currentUser}
              clubs={organizations as any}
              activities={activities}
              onRefresh={loadAllData}
            />
          </section>
        </ScrollFadeIn>

        {/* Section 05: [05] / DELIVERABLES & MULTI-CRITERIA RUBRICS */}
        <ScrollFadeIn direction="up">
          <section id="submissions" className="scroll-mt-28 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-sm font-black text-cyan-400 tracking-wider">
                [05]
              </span>
              <span className="text-sm font-bold text-white tracking-widest uppercase">
                Deliverables &amp; 100-Point Rubric Evaluation Engine
              </span>
              <span className="text-xs text-purple-300 font-semibold ml-auto hidden sm:inline">
                DYNAMIC MULTI-CRITERIA SCORING
              </span>
            </div>
            <SubmissionsView
              currentUser={currentUser}
              activities={activities}
              submissions={submissions}
              onRefresh={loadAllData}
            />
          </section>
        </ScrollFadeIn>

        {/* Section 06: [06] / VERIFIED TRANSCRIPTS & CERTIFICATES */}
        <ScrollFadeIn direction="up">
          <section id="certificates" className="scroll-mt-28 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10 font-mono">
              <span className="text-sm font-black text-cyan-400 tracking-wider">
                [06]
              </span>
              <span className="text-sm font-bold text-white tracking-widest uppercase">
                Verified Club Transcripts &amp; Cryptographic Credentials
              </span>
              <span className="text-xs text-amber-300 font-semibold ml-auto hidden sm:inline">
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
        </ScrollFadeIn>
      </main>

      {/* Refined Minimalist Footer */}
      <footer className="border-t border-white/10 bg-[#070b16]/80 backdrop-blur-2xl py-10 text-sm text-slate-400 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <GitclubLogo size="md" showText={true} />
          </div>
          <div className="flex flex-col sm:items-end text-center sm:text-right text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300">&copy; {new Date().getFullYear()} Gitclub &bull; Mirai School of Technology Club Operations Platform</span>
            <span className="font-mono text-slate-500">
              NEX-CELL (6 Tracks) &bull; Kaizen Tech (CP, Web, AI/DS) &bull; MALHAR &bull; Verifiable Ledger
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
