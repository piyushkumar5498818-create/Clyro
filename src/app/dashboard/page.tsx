"use client";

import { useState, useEffect } from "react";
import { Profile, Club, Activity, AttendanceRecord, Submission, Certificate, ClubMembership } from "@/types/database";
import { getCurrentUserAction, getAllProfilesAction, switchUserAction } from "@/actions/auth";
import {
  getAllClubsAction,
  getTopLevelClubsAction,
  getSocietySubClubsAction,
  getSocietyMetricsAction,
  getCollegeMetricsAction,
} from "@/actions/clubs";
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
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [topClubs, setTopClubs] = useState<Club[]>([]);
  const [societySubClubs, setSocietySubClubs] = useState<Club[]>([]);
  const [societyMetrics, setSocietyMetrics] = useState<any>(null);
  const [collegeMetrics, setCollegeMetrics] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [myMemberships, setMyMemberships] = useState<ClubMembership[]>([]);
  const [allMemberships, setAllMemberships] = useState<ClubMembership[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllData = async () => {
    try {
      const [
        user,
        profs,
        allCl,
        topCl,
        subCl,
        socMet,
        colMet,
        acts,
        myMems,
        subs,
        certs,
      ] = await Promise.all([
        getCurrentUserAction(),
        getAllProfilesAction(),
        getAllClubsAction(),
        getTopLevelClubsAction(),
        getSocietySubClubsAction(),
        getSocietyMetricsAction(),
        getCollegeMetricsAction(),
        getActivitiesAction(),
        getMyMembershipsAction(),
        getSubmissionsAction(),
        getCertificatesAction(),
      ]);

      setCurrentUser(user);
      setProfiles(profs);
      setAllClubs(allCl);
      setTopClubs(topCl);
      setSocietySubClubs(subCl);
      setSocietyMetrics(socMet);
      setCollegeMetrics(colMet);
      setActivities(acts);
      setMyMemberships(myMems);
      setSubmissions(subs);
      setCertificates(certs);

      // Load all memberships for coordinator view
      if (allCl.length > 0) {
        const memPromises = allCl.map((c) => getClubMembershipsAction(c.id));
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <div className="text-sm font-bold text-slate-700">Loading Clyro Campus Platform...</div>
        <div className="text-xs text-slate-400 mt-1">Connecting to MSOT activity ledger</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
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
            topClubs={topClubs}
            societyMetrics={societyMetrics}
            collegeMetrics={collegeMetrics}
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
            topClubs={topClubs}
            societySubClubs={societySubClubs}
            myMemberships={myMemberships}
            allMemberships={allMemberships}
            onRefresh={loadAllData}
          />
        )}

        {activeTab === "activities" && (
          <ActivityManagementView
            currentUser={currentUser}
            clubs={allClubs}
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
            clubs={allClubs}
            certificates={certificates}
            onRefresh={loadAllData}
          />
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Clyro — College Club Activities Tracker</span>
          <span className="font-mono text-[11px] text-slate-400">
            MSOT Academic Block A &middot; 4 Top-Level Clubs &middot; 4 Society Wings
          </span>
        </div>
      </footer>
    </div>
  );
}
