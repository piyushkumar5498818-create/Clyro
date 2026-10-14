"use server";

import { db } from "@/lib/store";
import { Submission, SubmissionType } from "@/types/database";

export async function submitWorkAction(
  activityId: string,
  submissionType: SubmissionType,
  payload: { linkUrl?: string; fileUrl?: string; notes?: string }
): Promise<{ success: boolean; data?: Submission; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    if (activeUser.role !== "student") {
      return { success: false, error: "Only enrolled students can submit activity work." };
    }

    if (submissionType === "link" && !payload.linkUrl) {
      return { success: false, error: "Please provide a valid submission URL/link." };
    }

    const sub = db.submitWork(activityId, activeUser.id, submissionType, payload);
    return { success: true, data: sub };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getSubmissionsAction(activityId?: string): Promise<Submission[]> {
  return db.getSubmissions(activityId);
}
