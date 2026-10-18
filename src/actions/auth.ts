"use server";

import { db } from "@/lib/store";
import { Profile } from "@/types/database";
import { cookies } from "next/headers";
import { signSessionToken, verifySessionToken } from "@/lib/auth";

const SESSION_COOKIE = "clyro_session";
const LEGACY_COOKIE = "clyro_user_id";

export async function getCurrentUserAction(): Promise<Profile> {
  const cookieStore = cookies();

  // 1. Check cryptographic session token
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionToken) {
    const verifiedSession = verifySessionToken(sessionToken);
    if (verifiedSession) {
      const user = db.getUserById(verifiedSession.userId);
      if (user) {
        db.setActiveUser(user.id);
        return user;
      }
    }
  }

  // 2. Fallback to legacy cookie if present
  const legacyUserId = cookieStore.get(LEGACY_COOKIE)?.value;
  if (legacyUserId) {
    const user = db.getUserById(legacyUserId);
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
    return { success: false, error: "Please enter your campus email address." };
  }

  const profiles = db.getAllProfiles();
  const user = profiles.find((p) => p.email.toLowerCase() === trimmedEmail);

  if (!user) {
    return {
      success: false,
      error: `No account registered with "${trimmedEmail}". Please use your Mirai credentials or choose a quick persona.`,
    };
  }

  // Generate cryptographically signed HMAC-SHA256 session token
  const token = signSessionToken(user.id, user.email, user.role);

  // Set active user in memory store and persist signed cookie
  db.setActiveUser(user.id);

  cookies().set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return { success: true, user };
}

export async function logoutAction(): Promise<{ success: boolean }> {
  cookies().delete(SESSION_COOKIE);
  cookies().delete(LEGACY_COOKIE);
  return { success: true };
}

export async function switchUserAction(userId: string): Promise<Profile> {
  const user = db.setActiveUser(userId);
  const token = signSessionToken(user.id, user.email, user.role);

  cookies().set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  return user;
}

export async function getAllProfilesAction(): Promise<Profile[]> {
  return db.getAllProfiles();
}
