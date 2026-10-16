"use client";

import { useState, useEffect } from "react";
import { Profile, Organization, Activity, AttendanceRecord, Submission, Certificate, OrganizationMembership } from "@/types/database";
import { getCurrentUserAction, getAllProfilesAction, switchUserAction } from "@/actions/auth";
import {
  getAllOrganizationsAction,
  getInstitutionalMetricsAction,
} from "@/actions/organizations";
import { getActivitiesAction } from "@/actions/activities";
import { getSubmissionsAction } from "@/actions/submissions";
import { getCertificatesAction } from "@/actions/certificates";
import { getMyMembershipsAction, getClubMembershipsAction } from "@/actions/memberships";
import { Navbar } from "@/components/Navbar";
import { OverviewView } from "@/components/OverviewView";
import { ClubsHierarchyView } from "@/components/ClubsHierarchyView";
import { ActivityManagementView } from "@/components/ActivityManagementView";
import { AttendanceView } from "@/components/AttendanceView";
import { SubmissionsView } from "@/components/SubmissionsView";
import { CertificatesView } from "@/components/CertificatesView";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

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

      // Load all memberships for coordinator/advisor view
      if (orgs.length > 0) {
        const memPromises = orgs.map((o) => getClubMembershipsAction(o.id));
        const nestedMems = await Promise.all(memPromises);
        setAllMemberships(nestedMems.flat());
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSwitchUser = async (userId: string) => {
    setLoading(true);
    await switchUserAction(userId);
    await loadAllData();
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center max-w-sm shadow-2xl border border-white/10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
            <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
          </div>
          <div className="text-base font-bold text-white tracking-tight">Loading Clyro Platform...</div>
          <div className="text-xs text-slate-400 mt-1.5">Connecting to Mirai authenticated campus ledger</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        currentUser={currentUser}
        profiles={profiles}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <OverviewView
            currentUser={currentUser}
            organizations={organizations}
            institutionalMetrics={institutionalMetrics}
            activities={activities}
            attendanceRecords={[]}
            submissions={submissions}
            certificates={certificates}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "clubs" && (
          <ClubsHierarchyView
            currentUser={currentUser}
            topClubs={organizations}
            societySubClubs={[]}
            myMemberships={myMemberships}
            allMemberships={allMemberships}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "activities" && (
          <ActivityManagementView
            currentUser={currentUser}
            clubs={organizations as any}
            activities={activities}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "attendance" && (
          <AttendanceView
            currentUser={currentUser}
            activities={activities}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "submissions" && (
          <SubmissionsView
            currentUser={currentUser}
            activities={activities}
            submissions={submissions}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "certificates" && (
          <CertificatesView
            currentUser={currentUser}
            clubs={organizations as any}
            certificates={certificates}
            onRefresh={loadAllData}
          />
        )}
      </main>

      <footer className="border-t border-white/10 bg-slate-900/40 backdrop-blur-2xl py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-slate-300 font-medium">&copy; {new Date().getFullYear()} Clyro — Mirai School of Technology</span>
          <span className="font-mono text-[11px] text-slate-400">
            NEX-CELL &middot; Kaizen Tech &middot; MALHAR &middot; Verified Activity Ledger
          </span>
        </div>
      </footer>
    </div>
  );
}
