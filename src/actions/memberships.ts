"use server";

import { db } from "@/lib/store";
import { ClubMembership } from "@/types/database";

export async function requestMembershipAction(
  clubId: string,
  type: "primary" | "secondary"
): Promise<{ success: boolean; data?: ClubMembership; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    if (activeUser.role !== "student") {
      return { success: false, error: "Only students can request club memberships." };
    }
    const mem = db.requestMembership(activeUser.id, clubId, type);
    return { success: true, data: mem };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getClubMembershipsAction(clubId: string): Promise<ClubMembership[]> {
  return db.getMembershipsByClub(clubId);
}

export async function getMyMembershipsAction(): Promise<ClubMembership[]> {
  const activeUser = db.getActiveUser();
  return db.getMembershipsByUser(activeUser.id);
}

export async function reviewMembershipAction(
  membershipId: string,
  status: "approved" | "rejected"
): Promise<{ success: boolean; data?: ClubMembership; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    if (
      activeUser.role !== "student_coordinator" &&
      activeUser.role !== "faculty_advisor" &&
      activeUser.role !== "college_admin"
    ) {
      return { success: false, error: "Unauthorized: only coordinators or advisors can review." };
    }
    const mem = db.reviewMembership(membershipId, status, activeUser.id);
    return { success: true, data: mem };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
