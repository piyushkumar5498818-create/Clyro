"use server";

import { db } from "@/lib/store";
import { OrganizationMembership } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";

export async function requestMembershipAction(
  orgId: string,
  type: "primary" | "secondary" = "primary"
): Promise<{ success: boolean; data?: OrganizationMembership; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (activeUser.role !== "student" && activeUser.role !== "member") {
      return { success: false, error: "Only student members can request organization memberships." };
    }
    const mem = db.requestMembership(activeUser.id, orgId, type);
    return { success: true, data: mem };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getClubMembershipsAction(orgId: string): Promise<OrganizationMembership[]> {
  return db.getMembershipsByOrg(orgId);
}

export async function getMyMembershipsAction(): Promise<OrganizationMembership[]> {
  const activeUser = await getCurrentUserAction();
  return db.getMembershipsByUser(activeUser.id);
}

export async function reviewMembershipAction(
  membershipId: string,
  status: "approved" | "rejected"
): Promise<{ success: boolean; data?: OrganizationMembership; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    const canReview = [
      "president",
      "vice_president",
      "lead",
      "admin",
      "student_coordinator",
      "faculty_advisor",
      "society_admin",
      "college_admin",
    ].includes(activeUser.role);
    if (!canReview) {
      return { success: false, error: "Unauthorized: only club presidents, vice presidents, leads, or campus admins can review memberships." };
    }
    const mem = db.reviewMembership(membershipId, status, activeUser.id);
    return { success: true, data: mem };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
