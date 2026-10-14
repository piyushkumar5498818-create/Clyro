"use server";

import { db } from "@/lib/store";
import { Activity, ActivityFormat } from "@/types/database";

export async function getActivitiesAction(clubId?: string): Promise<Activity[]> {
  return db.getActivities(clubId);
}

export async function getActivityByIdAction(activityId: string): Promise<Activity | undefined> {
  return db.getActivityById(activityId);
}

export async function createActivityAction(formData: {
  clubId: string;
  title: string;
  topic: string;
  format: ActivityFormat;
  deliverableDescription: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  submissionDeadline: string;
}): Promise<{ success: boolean; data?: Activity; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    if (
      activeUser.role !== "student_coordinator" &&
      activeUser.role !== "faculty_advisor" &&
      activeUser.role !== "college_admin"
    ) {
      return { success: false, error: "Only coordinators or admins can create activity plans." };
    }

    const newAct = db.createActivity({
      ...formData,
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
    if (
      activeUser.role !== "faculty_advisor" &&
      activeUser.role !== "college_admin" &&
      activeUser.role !== "campus_manager"
    ) {
      return { success: false, error: "Only faculty advisors or campus managers can approve activities." };
    }

    const reviewed = db.reviewActivity(activityId, approved, activeUser.id, reason);
    return { success: true, data: reviewed };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}
