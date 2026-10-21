"use client";

import { useState, useEffect, useMemo } from "react";
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
import { getActivitiesAction, syncCustomActivitiesAction } from "@/actions/activities";
import { getSubmissionsAction, syncCustomSubmissionsAction } from "@/actions/submissions";
import { syncCustomEvaluationsAction } from "@/actions/evaluations";
import { Evaluation } from "@/types/database";
import { getCertificatesAction } from "@/actions/certificates";
import { checkInStudentAction } from "@/actions/attendance";
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
import { TestingLogView } from "@/components/TestingLogView";
import { GitclubLogo } from "@/components/GitclubLogo";
import { scrollToSection } from "@/components/SmoothScroll";
import { ScrollFadeIn } from "@/components/ScrollFadeIn";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Loader2 } from "lucide-react";
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
      let localActs: Activity[] = [];
      try {
        const raw = localStorage.getItem("gitclub_custom_activities_v3");
        if (raw) localActs = JSON.parse(raw);
      } catch {}

      let localSubs: Submission[] = [];
      try {
        const raw = localStorage.getItem("gitclub_custom_submissions_v2");
        if (raw) localSubs = JSON.parse(raw);
      } catch {}

      let localEvals: Evaluation[] = [];
      try {
        const raw = localStorage.getItem("gitclub_custom_evaluations_v2");
        if (raw) localEvals = JSON.parse(raw);
      } catch {}

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
        syncCustomActivitiesAction(localActs),
        getMyMembershipsAction(),
        syncCustomSubmissionsAction(localSubs),
        getCertificatesAction(),
      ]);

      await syncCustomEvaluationsAction(localEvals);

      setCurrentUser(user);
      setProfiles(profs);
      setOrganizations(orgs);
      setInstitutionalMetrics(instMet);
      setActivities(acts);
      setMyMemberships(myMems);
      setSubmissions(subs);
      setCertificates(certs);

      // Persist custom activities to client storage
      try {
        const customOnly = acts.filter((a) => !a.id.startsWith("a0000000"));
        if (customOnly.length > 0) {
          localStorage.setItem("gitclub_custom_activities_v3", JSON.stringify(customOnly));
        }
      } catch {}

      // Persist custom submissions to client storage
      try {
        const customSubsOnly = subs.filter((s) => !s.id.startsWith("s0000000"));
        if (customSubsOnly.length > 0) {
          localStorage.setItem("gitclub_custom_submissions_v2", JSON.stringify(customSubsOnly));
        }
      } catch {}

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

  // Auto check-in if tester arrived via phone camera QR scan (?checkin=CODE&activityId=ID)
  useEffect(() => {
    if (typeof window === "undefined" || !currentUser) return;
    const params = new URLSearchParams(window.location.search);
    const checkinCode = params.get("checkin");
    const actId = params.get("activityId");

    if (checkinCode) {
      scrollToSection("attendance");
      checkInStudentAction(actId || "", checkinCode, "qr_code")
        .then((res) => {
          if (res.success) {
            alert(`QR Check-In Verified! Attendance recorded for: ${checkinCode}`);
            loadAllData();
          } else {
            console.log("[QR Check-In] Result:", res.error);
          }
        })
        .finally(() => {
          // Clean URL params cleanly without refreshing
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, "", cleanUrl);
        });
    }
  }, [currentUser]);

  // Track active section for Lenis smooth scroll indicators
  useEffect(() => {
    const sectionIds = [
      "overview",
      "clubs",
      "attendance",
      "activities",
      "submissions",
      "certificates",
      "testing-log",
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

  // Role-based Club Activity & Assignment Visibility:
  // "visibilyt of assignemnt and activity should remain to same club memebers only"
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "college_admin";

  const userEnrolledClubIds = useMemo(() => {
    const clubIds = new Set<string>();
    if (currentUser?.organizationId) {
      clubIds.add(currentUser.organizationId);
    }
    myMemberships
      .filter((m) => m.status === "approved")
      .forEach((m) => clubIds.add(m.organizationId));
    allMemberships
      .filter(
        (m) =>
          m.userId === currentUser?.id &&
          m.status === "approved"
      )
      .forEach((m) => clubIds.add(m.organizationId));
    return clubIds;
  }, [currentUser, myMemberships, allMemberships]);

  // If not Campus Administrator, strictly restrict activities to the user's club(s)
  const visibleActivities = useMemo(() => {
    if (isAdmin) {
      return activities;
    }
    return activities.filter((act) => userEnrolledClubIds.has(act.organizationId));
  }, [isAdmin, activities, userEnrolledClubIds]);

  // If not Campus Administrator, strictly restrict submissions/assignments to the user's club(s)
  const visibleSubmissions = useMemo(() => {
    if (isAdmin) {
      return submissions;
    }
    const allowedActivityIds = new Set(visibleActivities.map((a) => a.id));
    return submissions.filter((s) => allowedActivityIds.has(s.activityId));
  }, [isAdmin, submissions, visibleActivities]);

  // If not Campus Administrator, strictly restrict clubs for hosting activities to the user's club(s)
  const visibleClubs = useMemo(() => {
    if (isAdmin) {
      return organizations;
    }
    return organizations.filter((org) => userEnrolledClubIds.has(org.id));
  }, [isAdmin, organizations, userEnrolledClubIds]);

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
        activeSection={activeSection}
      />

      {/* Fully-Responsive Dynamic Container (Expands fluidly on desktop/tablets, fits 100% on phones) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-6 space-y-8 pb-28 md:pb-16">
        {/* Section 01: [01] / OVERVIEW & CAMPUS CLUBS METRICS */}
        <ScrollFadeIn direction="up">
          <section id="overview" className="scroll-mt-20 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10 font-mono">
              <span className="text-xs font-black text-cyan-400 tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/30">
                [01]
              </span>
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                Overview &amp; Metrics
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold ml-auto font-mono">
                MIRAI CAMPUS
              </span>
            </div>
            <OverviewView
              currentUser={currentUser}
              organizations={organizations}
              institutionalMetrics={institutionalMetrics}
              activities={visibleActivities}
              attendanceRecords={[]}
              submissions={visibleSubmissions}
              certificates={certificates}
            />
          </section>
        </ScrollFadeIn>

        {/* Section 02: [02] / CLUBS, DOMAINS & MEMBER SECTION */}
        <ScrollFadeIn direction="up">
          <section id="clubs" className="scroll-mt-20 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10 font-mono">
              <span className="text-xs font-black text-cyan-400 tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/30">
                [02]
              </span>
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                Clubs &amp; Teams
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold ml-auto font-mono">
                3 CLUBS &bull; 8 UNITS
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
          <section id="attendance" className="scroll-mt-20 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10 font-mono">
              <span className="text-xs font-black text-emerald-400 tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/30">
                [03]
              </span>
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                Live Check-In
              </span>
              <span className="text-[10px] text-emerald-300 font-semibold ml-auto font-mono">
                DYNAMIC QR &amp; TOTP
              </span>
            </div>
            <AttendanceView
              currentUser={currentUser}
              activities={visibleActivities}
              onRefresh={loadAllData}
            />
          </section>
        </ScrollFadeIn>

        {/* Section 04: [04] / ACTIVITY PROPOSALS & LEADERSHIP APPROVALS */}
        <ScrollFadeIn direction="up">
          <section id="activities" className="scroll-mt-20 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10 font-mono">
              <span className="text-xs font-black text-blue-400 tracking-wider px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-400/30">
                [04]
              </span>
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                Activity Proposals
              </span>
              <span className="text-[10px] text-blue-300 font-semibold ml-auto font-mono">
                GOVERNANCE DESK
              </span>
            </div>
            <ActivityManagementView
              currentUser={currentUser}
              clubs={visibleClubs as any}
              activities={visibleActivities}
              onRefresh={loadAllData}
            />
          </section>
        </ScrollFadeIn>

        {/* Section 05: [05] / DELIVERABLES & MULTI-CRITERIA RUBRICS */}
        <ScrollFadeIn direction="up">
          <section id="submissions" className="scroll-mt-20 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10 font-mono">
              <span className="text-xs font-black text-purple-400 tracking-wider px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-400/30">
                [05]
              </span>
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                Deliverables &amp; Rubrics
              </span>
              <span className="text-[10px] text-purple-300 font-semibold ml-auto font-mono">
                100-PT ENGINE
              </span>
            </div>
            <SubmissionsView
              currentUser={currentUser}
              activities={visibleActivities}
              submissions={visibleSubmissions}
              onRefresh={loadAllData}
            />
          </section>
        </ScrollFadeIn>

        {/* Section 06: [06] / VERIFIED TRANSCRIPTS & CERTIFICATES */}
        <ScrollFadeIn direction="up">
          <section id="certificates" className="scroll-mt-20 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10 font-mono">
              <span className="text-xs font-black text-amber-400 tracking-wider px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30">
                [06]
              </span>
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                Verified Ledger
              </span>
              <span className="text-[10px] text-amber-300 font-semibold ml-auto font-mono">
                /VERIFY PUBLIC
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

        {/* Section 07: [07] / MULTI-USER TESTING LOG */}
        <ScrollFadeIn direction="up">
          <section id="testing-log" className="scroll-mt-20 space-y-3.5">
            <div className="flex items-center gap-2 pb-2.5 border-b border-white/10 font-mono">
              <span className="text-xs font-black text-cyan-400 tracking-wider px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-400/30">
                [07]
              </span>
              <span className="text-xs font-bold text-white tracking-wider uppercase truncate">
                Multi-User Testing Log
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold ml-auto font-mono">
                5-FIELD SYNCHRONIZED QA
              </span>
            </div>
            <TestingLogView currentUser={currentUser} />
          </section>
        </ScrollFadeIn>

        {/* Mobile-Friendly Minimalist Footer */}
        <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-400 space-y-2">
          <div className="flex justify-center">
            <GitclubLogo size="sm" showText={true} />
          </div>
          <p className="text-[11px] text-slate-400">
            &copy; {new Date().getFullYear()} Gitclub &bull; Mirai School of Technology
          </p>
          <p className="font-mono text-[10px] text-slate-500">
            NEX-CELL &bull; Kaizen Tech &bull; MALHAR
          </p>
        </footer>
      </main>

      {/* Sticky Mobile Bottom Navigation Dock */}
      <MobileBottomNav activeSection={activeSection} />
    </div>
  );
}
