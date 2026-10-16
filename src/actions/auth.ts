"use server";

import { db } from "@/lib/store";
import { Profile } from "@/types/database";

export async function getCurrentUserAction(): Promise<Profile> {
  return db.getActiveUser();
}

export async function switchUserAction(userId: string): Promise<Profile> {
  const isDemoAllowed =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  if (!isDemoAllowed) {
    throw new Error("Persona switcher is disabled in production environments.");
  }

  return db.setActiveUser(userId);
}

export async function getAllProfilesAction(): Promise<Profile[]> {
  return db.getAllProfiles();
}
