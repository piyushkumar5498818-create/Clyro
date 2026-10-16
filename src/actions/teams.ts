"use server";

import { db } from "@/lib/store";
import { Team } from "@/types/database";

export async function createTeamAction(
  activityId: string,
  name: string,
  memberUserIds: string[]
): Promise<{ success: boolean; data?: Team; error?: string }> {
  try {
    const activeUser = db.getActiveUser();
    if (activeUser.role !== "student") {
      return { success: false, error: "Only students can form event teams." };
    }

    if (!name || name.trim().length < 3) {
      return { success: false, error: "Team name must be at least 3 characters." };
    }

    const team = db.createTeam(activityId, name.trim(), activeUser.id, memberUserIds);
    return { success: true, data: team };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getTeamsAction(activityId?: string): Promise<Team[]> {
  return db.getTeams(activityId);
}
