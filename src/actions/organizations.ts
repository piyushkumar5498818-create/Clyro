"use server";

import { db } from "@/lib/store";
import { Organization, OrganizationUnit, Initiative } from "@/types/database";

export async function getAllOrganizationsAction(): Promise<Organization[]> {
  return db.getAllOrganizations();
}

export async function getOrganizationByIdAction(id: string): Promise<Organization | undefined> {
  return db.getOrganizationById(id);
}

export async function getOrganizationUnitsAction(orgId?: string): Promise<OrganizationUnit[]> {
  return db.getUnits(orgId);
}

export async function getInitiativesAction(orgId?: string): Promise<Initiative[]> {
  return db.getInitiatives(orgId);
}

export async function getInstitutionalMetricsAction() {
  return db.getInstitutionalMetrics();
}

export async function createOrganizationAction(data: {
  campusId?: string;
  name: string;
  shortName: string;
  description: string;
  type: Organization["type"];
  facultyAdvisorName?: string;
  presidentName?: string;
  capacity?: number;
  meetingRules?: string;
}): Promise<{ success: boolean; data?: Organization; error?: string }> {
  try {
    const { getCurrentUserAction } = await import("./auth");
    const activeUser = await getCurrentUserAction();
    const isAdmin =
      activeUser?.role === "admin" ||
      activeUser?.role === "college_admin" ||
      activeUser?.role === "campus_manager";
    if (!isAdmin) {
      return {
        success: false,
        error: "Only Campus Administrators and Campus Managers can register new clubs.",
      };
    }

    if (!data.name || data.name.trim().length < 3) {
      return { success: false, error: "Club name must be at least 3 characters." };
    }

    const org = db.createOrganization(data);

    try {
      const { testingStore } = await import("@/lib/testing-store");
      testingStore.recordAction({
        userId: activeUser?.id || "admin",
        role: activeUser?.role || "admin",
        userFullName: activeUser?.fullName || "Campus Administrator",
        doneWhatExactly: `Created new club registry entry: "${org.name}" (Capacity: ${org.capacity})`,
        outcome: "Successful",
        targetEntityId: org.id,
      });
    } catch {}

    return { success: true, data: org };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

// Backward compatibility aliases for existing views
export async function getAllClubsAction(): Promise<any[]> {
  return db.getAllOrganizations().map((o) => ({
    ...o,
    isSociety: o.type === "cultural_society",
    parentClubId: null,
  }));
}

export async function getTopLevelClubsAction(): Promise<any[]> {
  return getAllClubsAction();
}

export async function getSocietySubClubsAction(): Promise<any[]> {
  const units = db.getUnits();
  return units.map((u) => ({
    ...u,
    isSociety: false,
    parentClubId: u.organizationId,
  }));
}

export async function getCollegeMetricsAction() {
  const metrics = db.getInstitutionalMetrics();
  return {
    totalTopLevelClubs: metrics.totalOrganizations,
    societySubClubsCount: metrics.totalUnits,
    totalClubsAndWings: metrics.totalOrganizations + metrics.totalUnits,
    totalEnrolledStudents: metrics.totalEnrolledStudents,
    totalAttendanceLogs: metrics.totalAttendanceLogs,
    totalSubmissions: metrics.totalSubmissions,
    totalActivities: metrics.organizationsBreakdown.reduce((acc, curr) => acc + curr.activitiesCount, 0),
  };
}

export async function getSocietyMetricsAction() {
  const metrics = db.getInstitutionalMetrics();
  const malhar = metrics.organizationsBreakdown.find((o) => o.type === "cultural_society");
  const units = db.getUnits(malhar?.id);
  return {
    societyName: malhar?.name || "MALHAR — Cultural Society",
    subClubsCount: units.length,
    subClubsList: units.map((u) => ({
      id: u.id,
      name: u.name,
      membersCount: u.memberCount || 0,
      activitiesCount: 1,
    })),
    totalUniqueMembers: malhar?.memberCount || 1,
    totalActivities: malhar?.activitiesCount || 1,
    totalAttendanceRecorded: 1,
    totalSubmissions: 1,
  };
}
