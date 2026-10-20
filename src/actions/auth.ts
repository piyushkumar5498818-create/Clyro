"use server";

import { db } from "@/lib/store";
import { Profile } from "@/types/database";
import { cookies } from "next/headers";
import { testingStore } from "@/lib/testing-store";
import {
  signSessionToken,
  verifySessionToken,
  validateGoogleWorkspaceEmail,
  isGoogleOAuthLive,
  getGoogleOAuthUrl,
  GOOGLE_WORKSPACE_DOMAIN,
} from "@/lib/auth";

const SESSION_COOKIE = "gitclub_session";
const LEGACY_SESSION_COOKIE = "clyro_session";
const LEGACY_COOKIE = "clyro_user_id";

export async function getCurrentUserAction(): Promise<Profile> {
  const cookieStore = cookies();

  // 1. Check cryptographic session token
  const sessionToken =
    cookieStore.get(SESSION_COOKIE)?.value ||
    cookieStore.get(LEGACY_SESSION_COOKIE)?.value;
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
  const user =
    profiles.find((p) => p.email.toLowerCase() === trimmedEmail) ||
    (trimmedEmail === "alex.student@mirai.edu"
      ? profiles.find((p) => p.id === "u0000000-0000-0000-0000-000000000008")
      : undefined);

  if (!user) {
    return {
      success: false,
      error: `No account registered with "${trimmedEmail}". Please use your Mirai credentials or choose a quick persona.`,
    };
  }

  // Generate cryptographically signed HMAC-SHA256 session token
  const token = signSessionToken(user.id, user.email, user.role, "credentials");

  // Set active user in memory store and persist signed cookie
  db.setActiveUser(user.id);

  cookies().set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Record authenticated testing session
  try {
    testingStore.startSession(user.id, user.role, user.fullName);
  } catch (logErr) {
    console.error("[TestingStore] Failed to record login session:", logErr);
  }

  return { success: true, user };
}

/**
 * Authenticates a user via Mirai Google Workspace Single Sign-On (SSO).
 * Strictly restricts access to the authorized Google Workspace institutional domain.
 */
export async function googleWorkspaceAuthAction(
  email: string,
  fullName?: string,
  avatarUrl?: string
): Promise<{ success: boolean; user?: Profile; error?: string }> {
  const validation = validateGoogleWorkspaceEmail(email);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Find or Just-In-Time provision the student profile for this Google Workspace identity
  const user = db.findOrCreateGoogleProfile(email, fullName, avatarUrl);

  // Generate HMAC-SHA256 session token with Google Workspace provider marker
  const token = signSessionToken(user.id, user.email, user.role, "google_workspace");

  db.setActiveUser(user.id);

  cookies().set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  try {
    testingStore.startSession(user.id, user.role, user.fullName, "Google Workspace SSO");
  } catch (logErr) {
    console.error("[TestingStore] Failed to record SSO login session:", logErr);
  }

  return { success: true, user };
}

/**
 * Returns Google Workspace SSO configuration for client rendering.
 */
export async function getGoogleAuthMetadataAction(): Promise<{
  domain: string;
  isLive: boolean;
  oauthUrl: string | null;
}> {
  const isLive = isGoogleOAuthLive();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  return {
    domain: GOOGLE_WORKSPACE_DOMAIN,
    isLive,
    oauthUrl: isLive ? getGoogleOAuthUrl(redirectUri) : null,
  };
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const activeUser = await getCurrentUserAction();
    if (activeUser) {
      testingStore.endSession(activeUser.id);
    }
  } catch (logErr) {
    console.error("[TestingStore] Failed to record logout:", logErr);
  }

  cookies().delete(SESSION_COOKIE);
  cookies().delete(LEGACY_SESSION_COOKIE);
  cookies().delete(LEGACY_COOKIE);
  return { success: true };
}

export async function switchUserAction(userId: string): Promise<Profile> {
  // Gracefully close previous active user session if switching personas
  try {
    const prevUser = await getCurrentUserAction();
    if (prevUser && prevUser.id !== userId) {
      testingStore.endSession(prevUser.id);
    }
  } catch (err) {
    console.error("[switchUserAction] Error ending previous session:", err);
  }

  const user = db.setActiveUser(userId);
  const token = signSessionToken(user.id, user.email, user.role);

  cookies().set(SESSION_COOKIE, token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });

  try {
    testingStore.startSession(user.id, user.role, user.fullName, "Persona Switch");
  } catch (logErr) {
    console.error("[TestingStore] Failed to record switch session:", logErr);
  }

  return user;
}

export async function getAllProfilesAction(): Promise<Profile[]> {
  return db.getAllProfiles();
}
