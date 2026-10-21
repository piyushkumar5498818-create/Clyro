"use server";

import { db } from "@/lib/store";
import { Evaluation } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";
import { testingStore } from "@/lib/testing-store";

export async function evaluateSubmissionAction(
  submissionId: string,
  scoreBreakdownOrRubric: any,
  legacyFeedback?: string
): Promise<{ success: boolean; data?: Evaluation; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to evaluate submissions." };
    }

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

    const submission = db.getSubmissions().find((s) => s.id === submissionId);
    if (!submission) {
      return { success: false, error: "Submission not found." };
    }

    const activity = db.getActivityById(submission.activityId);
    if (!activity) {
      return { success: false, error: "Associated activity not found." };
    }

    const isAdmin = activeUser.role === "admin" || activeUser.role === "college_admin";
    if (!isAdmin) {
      const reviewerClubIds = new Set<string>();
      if (activeUser.organizationId) reviewerClubIds.add(activeUser.organizationId);
      db.getMembershipsByUser(activeUser.id)
        .filter((m) => m.status === "approved")
        .forEach((m) => reviewerClubIds.add(m.organizationId));

      if (!reviewerClubIds.has(activity.organizationId)) {
        return {
          success: false,
          error: "Permission denied: You can only evaluate deliverables for your own club.",
        };
      }
    }

    let breakdown: { criteriaName: string; score: number; maxScore: number }[] = [];
    let feedback = legacyFeedback || "";

    if (Array.isArray(scoreBreakdownOrRubric)) {
      breakdown = scoreBreakdownOrRubric;
    } else if (scoreBreakdownOrRubric.breakdown && Array.isArray(scoreBreakdownOrRubric.breakdown)) {
      breakdown = scoreBreakdownOrRubric.breakdown;
      feedback = scoreBreakdownOrRubric.feedback || feedback;
    } else if (scoreBreakdownOrRubric.scoreContent !== undefined) {
      // Legacy 40/30/30 rubric compatibility
      breakdown = [
        { criteriaName: "Content & Technical Depth", score: scoreBreakdownOrRubric.scoreContent, maxScore: 40 },
        { criteriaName: "Presentation & Clarity", score: scoreBreakdownOrRubric.scorePresentation, maxScore: 30 },
        { criteriaName: "Participation & Timeliness", score: scoreBreakdownOrRubric.scoreParticipation, maxScore: 30 },
      ];
      feedback = scoreBreakdownOrRubric.feedback || feedback;
    }

    const evaluation = db.evaluateSubmission(submissionId, activeUser.id, breakdown, feedback);

    // Verify evaluation persisted in backend store
    const verified = Boolean(evaluation && evaluation.totalScore !== undefined);

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Graded deliverable submission with rubric score: ${evaluation.totalScore}/100`,
        outcome: verified ? "Successful" : "Failed",
        targetEntityId: submissionId,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record evaluation action:", logErr);
    }

    return { success: true, data: evaluation };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function syncCustomEvaluationsAction(
  clientEvaluations: Evaluation[]
): Promise<Evaluation[]> {
  try {
    if (clientEvaluations && Array.isArray(clientEvaluations) && clientEvaluations.length > 0) {
      return db.mergeCustomEvaluations(clientEvaluations);
    }
    return db.getAllEvaluations();
  } catch (err) {
    console.error("[syncCustomEvaluationsAction] Error:", err);
    return db.getAllEvaluations();
  }
}
