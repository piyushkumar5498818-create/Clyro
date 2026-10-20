"use server";

import { db } from "@/lib/store";
import { Activity, ActivityFormat, RubricCriteria } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";
import { testingStore } from "@/lib/testing-store";

export async function getActivitiesAction(orgId?: string): Promise<Activity[]> {
  return db.getActivities(orgId);
}

export async function getActivityByIdAction(activityId: string): Promise<Activity | undefined> {
  return db.getActivityById(activityId);
}

export async function createActivityAction(formData: {
  clubId?: string; // backward compat
  organizationId?: string;
  unitId?: string;
  initiativeId?: string;
  title: string;
  topic: string;
  format: ActivityFormat;
  deliverableDescription: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  submissionDeadline: string;
  rubricCriteria?: RubricCriteria[];
}): Promise<{ success: boolean; data?: Activity; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to propose activity plans." };
    }

    const canCreate = [
      "president",
      "vice_president",
      "lead",
      "admin",
      "student_coordinator",
      "society_admin",
      "unit_lead",
      "faculty_advisor",
      "college_admin",
    ].includes(activeUser.role);
    if (!canCreate) {
      return { success: false, error: "Only presidents, vice presidents, leads, or campus admins can propose activity plans." };
    }

    const orgId = formData.organizationId || formData.clubId;
    if (!orgId) {
      return { success: false, error: "Organization must be selected." };
    }

    const newAct = db.createActivity({
      organizationId: orgId,
      unitId: formData.unitId,
      initiativeId: formData.initiativeId,
      title: formData.title,
      topic: formData.topic,
      format: formData.format,
      deliverableDescription: formData.deliverableDescription,
      scheduledDate: formData.scheduledDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venue: formData.venue,
      submissionDeadline: formData.submissionDeadline,
      rubricCriteria: formData.rubricCriteria || [
        { name: "Technical/Creative Depth", maxScore: 40, description: "Depth of execution and deliverable quality." },
        { name: "Presentation & Communication", maxScore: 30, description: "Clarity of demonstration and documentation." },
        { name: "Timeliness & Participation", maxScore: 30, description: "Attendance adherence and discussion engagement." },
      ],
      createdBy: activeUser.id,
    });

    // Verify persisted state in backend store
    const persisted = db.getActivityById(newAct.id);
    const verified = Boolean(persisted && persisted.id === newAct.id);

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Created and submitted activity proposal: "${newAct.title}"`,
        outcome: verified ? "Successful" : "Failed",
        targetEntityId: newAct.id,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record create activity action:", logErr);
    }

    return { success: true, data: newAct };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function reviewActivityAction(
  activityId: string,
  approved: boolean,
  reason?: string
): Promise<{ success: boolean; data?: Activity; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to review activities." };
    }

    const canApprove = [
      "president",
      "vice_president",
      "admin",
      "faculty_advisor",
      "college_admin",
      "campus_manager",
    ].includes(activeUser.role);
    if (!canApprove) {
      return { success: false, error: "Only presidents, vice presidents, or campus admins can approve activities." };
    }

    const reviewed = db.reviewActivity(activityId, approved, activeUser.id, reason);

    // Verify status transition in backend store
    const persisted = db.getActivityById(activityId);
    const expectedStatus = approved ? "approved" : "rejected";
    const verified = Boolean(persisted && persisted.status === expectedStatus);

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: approved
          ? `Approved activity plan: "${reviewed.title}"`
          : `Rejected activity plan: "${reviewed.title}"`,
        outcome: verified ? "Successful" : "Failed",
        targetEntityId: activityId,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record review activity action:", logErr);
    }

    return { success: true, data: reviewed };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Synchronizes client-side custom activities with the server.
 * Guarantees custom activities persist across cold starts and deployments.
 */
export async function syncCustomActivitiesAction(
  clientActivities: Activity[]
): Promise<Activity[]> {
  try {
    if (clientActivities && Array.isArray(clientActivities) && clientActivities.length > 0) {
      return db.mergeCustomActivities(clientActivities);
    }
    return db.getActivities();
  } catch (err) {
    console.error("[syncCustomActivitiesAction] Error:", err);
    return db.getActivities();
  }
}
