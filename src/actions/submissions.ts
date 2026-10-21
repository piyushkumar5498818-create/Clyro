"use server";

import { db } from "@/lib/store";
import { Submission, SubmissionType } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";
import { testingStore } from "@/lib/testing-store";

export async function submitWorkAction(
  activityId: string,
  submissionType: SubmissionType,
  payload: { linkUrl?: string; fileUrl?: string; notes?: string }
): Promise<{ success: boolean; data?: Submission; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to submit work." };
    }

    const canSubmit = [
      "student",
      "member",
      "lead",
      "unit_lead",
      "president",
      "vice_president",
      "admin",
      "student_coordinator",
      "society_admin",
      "college_admin",
    ].includes(activeUser.role);

    if (!canSubmit) {
      return { success: false, error: "Only enrolled club participants can submit activity deliverables." };
    }

    if (!activityId || !activityId.trim()) {
      return { success: false, error: "Please select a valid activity for submission." };
    }

    if (submissionType === "link" && (!payload.linkUrl || !payload.linkUrl.trim())) {
      return { success: false, error: "Please provide a valid submission URL/link." };
    }

    const activity = db.getActivityById(activityId);
    if (!activity) {
      return { success: false, error: "Activity not found." };
    }

    const isAdmin = activeUser.role === "admin" || activeUser.role === "college_admin";
    if (!isAdmin) {
      const userClubIds = new Set<string>();
      if (activeUser.organizationId) userClubIds.add(activeUser.organizationId);
      db.getMembershipsByUser(activeUser.id)
        .filter((m) => m.status === "approved")
        .forEach((m) => userClubIds.add(m.organizationId));

      if (!userClubIds.has(activity.organizationId)) {
        return {
          success: false,
          error: "Permission denied: You can only submit deliverables for your enrolled club.",
        };
      }
    }

    const sub = db.submitWork(activityId, activeUser.id, submissionType, payload);

    // Verify submission persisted in backend store
    const allSubs = db.getSubmissions(activityId);
    const verified = Boolean(allSubs.some((s) => s.id === sub.id && s.userId === activeUser.id));

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Submitted deliverable link: ${payload.linkUrl || "Uploaded File"} for "${activity?.title || "Activity"}"`,
        outcome: verified ? "Successful" : "Failed",
        targetEntityId: sub.id,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record submit deliverable action:", logErr);
    }

    return { success: true, data: sub };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getSubmissionsAction(activityId?: string): Promise<Submission[]> {
  return db.getSubmissions(activityId);
}

export async function syncCustomSubmissionsAction(
  clientSubmissions: Submission[]
): Promise<Submission[]> {
  try {
    if (clientSubmissions && Array.isArray(clientSubmissions) && clientSubmissions.length > 0) {
      return db.mergeCustomSubmissions(clientSubmissions);
    }
    return db.getSubmissions();
  } catch (err) {
    console.error("[syncCustomSubmissionsAction] Error:", err);
    return db.getSubmissions();
  }
}
