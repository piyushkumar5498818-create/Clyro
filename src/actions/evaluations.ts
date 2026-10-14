"use server";

import { db } from "@/lib/store";
import { Evaluation } from "@/types/database";

export async function evaluateSubmissionAction(
  submissionId: string,
  rubric: {
    scoreContent: number;
    scorePresentation: number;
    scoreParticipation: number;
    feedback: string;
  }
): Promise<{ success: boolean; data?: Evaluation; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    if (
      activeUser.role !== "faculty_advisor" &&
      activeUser.role !== "student_coordinator" &&
      activeUser.role !== "college_admin"
    ) {
      return { success: false, error: "Only faculty advisors or coordinators can evaluate submissions." };
    }

    const evaluation = db.evaluateSubmission(submissionId, activeUser.id, rubric);
    return { success: true, data: evaluation };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
