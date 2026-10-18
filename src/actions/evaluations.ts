"use server";

import { db } from "@/lib/store";
import { Evaluation } from "@/types/database";

export async function evaluateSubmissionAction(
  submissionId: string,
  scoreBreakdownOrRubric: any,
  legacyFeedback?: string
): Promise<{ success: boolean; data?: Evaluation; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    const canEvaluate = [
      "president",
      "vice_president",
      "lead",
      "admin",
      "faculty_advisor",
      "student_coordinator",
      "unit_lead",
      "society_admin",
      "college_admin",
    ].includes(activeUser.role);
    if (!canEvaluate) {
      return { success: false, error: "Only presidents, vice presidents, leads, or campus admins can evaluate submissions." };
    }

    let breakdown: { criteriaName: string; score: number; maxScore: number }[] = [];
    let feedback = legacyFeedback || "";

    if (Array.isArray(scoreBreakdownOrRubric)) {
      breakdown = scoreBreakdownOrRubric;
    } else if (scoreBreakdownOrRubric.scoreContent !== undefined) {
      // Legacy 40/30/30 rubric compatibility
      breakdown = [
        { criteriaName: "Content & Technical Depth", score: scoreBreakdownOrRubric.scoreContent, maxScore: 40 },
        { criteriaName: "Presentation & Clarity", score: scoreBreakdownOrRubric.scorePresentation, maxScore: 30 },
        { criteriaName: "Participation & Timeliness", score: scoreBreakdownOrRubric.scoreParticipation, maxScore: 30 },
      ];
      feedback = scoreBreakdownOrRubric.feedback || feedback;
    } else if (scoreBreakdownOrRubric.breakdown) {
      breakdown = scoreBreakdownOrRubric.breakdown;
      feedback = scoreBreakdownOrRubric.feedback || feedback;
    }

    const evaluation = db.evaluateSubmission(submissionId, activeUser.id, breakdown, feedback);
    return { success: true, data: evaluation };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
