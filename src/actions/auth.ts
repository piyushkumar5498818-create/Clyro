"use server";

import { db } from "@/lib/store";
import { Profile } from "@/types/database";

export async function getCurrentUserAction(): Promise<Profile> {
  return db.getActiveUser();
}

export async function switchUserAction(userId: string): Promise<Profile> {
  return db.setActiveUser(userId);
}

export async function getAllProfilesAction(): Promise<Profile[]> {
  return db.getAllProfiles();
}
