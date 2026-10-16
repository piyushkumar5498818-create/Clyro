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
