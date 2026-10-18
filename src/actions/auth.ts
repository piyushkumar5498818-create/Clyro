"use server";

import { db } from "@/lib/store";
import { Profile } from "@/types/database";
import { cookies } from "next/headers";

const COOKIE_NAME = "clyro_user_id";

export async function getCurrentUserAction(): Promise<Profile> {
  const cookieStore = cookies();
  const userIdCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (userIdCookie) {
    const user = db.getUserById(userIdCookie);
    if (user) {
      db.setActiveUser(user.id);
      return user;
    }
  }
  return db.getActiveUser();
}

export async function loginAction(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: Profile; error?: string }> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail) {
    return { success: false, error: "Please provide your campus email address." };
  }

  const profiles = db.getAllProfiles();
  const user = profiles.find((p) => p.email.toLowerCase() === trimmedEmail);

  if (!user) {
    return {
      success: false,
      error: `No Mirai account found for "${trimmedEmail}". Please use a registered campus email or select a quick persona.`,
    };
  }

  // Set active user in store and write cookie
  db.setActiveUser(user.id);
  cookies().set(COOKIE_NAME, user.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true, user };
}

export async function logoutAction(): Promise<{ success: boolean }> {
  cookies().delete(COOKIE_NAME);
  return { success: true };
}

export async function switchUserAction(userId: string): Promise<Profile> {
  const user = db.setActiveUser(userId);
  cookies().set(COOKIE_NAME, user.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
  return user;
}

export async function getAllProfilesAction(): Promise<Profile[]> {
  return db.getAllProfiles();
}
