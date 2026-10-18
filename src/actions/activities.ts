"use server";

import { db } from "@/lib/store";
import { Activity, ActivityFormat, RubricCriteria } from "@/types/database";

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
    const activeUser = db.getActiveUser();
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
    const activeUser = db.getActiveUser();
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
    return { success: true, data: reviewed };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
