"use server";

import { db } from "@/lib/store";
import { Team } from "@/types/database";
import { getCurrentUserAction } from "@/actions/auth";
import { testingStore } from "@/lib/testing-store";

export async function createTeamAction(
  activityId: string,
  name: string,
  memberUserIds: string[]
): Promise<{ success: boolean; data?: Team; error?: string }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (!activeUser) {
      return { success: false, error: "Authentication required to form event teams." };
    }

    if (activeUser.role !== "student" && activeUser.role !== "member") {
      return { success: false, error: "Only student members can form event teams." };
    }

    if (!name || name.trim().length < 3) {
      return { success: false, error: "Team name must be at least 3 characters." };
    }

    const team = db.createTeam(activityId, name.trim(), activeUser.id, memberUserIds);

    try {
      testingStore.recordAction({
        userId: activeUser.id,
        role: activeUser.role,
        userFullName: activeUser.fullName,
        doneWhatExactly: `Created event team: "${name.trim()}" (${memberUserIds.length + 1} members)`,
        outcome: team ? "Successful" : "Failed",
        targetEntityId: team.id,
      });
    } catch (logErr) {
      console.error("[TestingStore] Failed to record create team action:", logErr);
    }

    return { success: true, data: team };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message };
  }
}

export async function getTeamsAction(activityId?: string): Promise<Team[]> {
  return db.getTeams(activityId);
}
