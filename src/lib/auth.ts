import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "clyro-mirai-session-secret-2024-msot";
export const GOOGLE_WORKSPACE_DOMAIN =
  process.env.GOOGLE_WORKSPACE_DOMAIN ||
  process.env.NEXT_PUBLIC_GOOGLE_WORKSPACE_DOMAIN ||
  "mirai.edu";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  authProvider?: "google_workspace" | "credentials";
  issuedAt: number;
  expiresAt: number;
}

/**
 * Validates that an email belongs to the authorized Google Workspace domain.
 */
export function validateGoogleWorkspaceEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== "string") {
    return { valid: false, error: "Email address is required." };
  }

  const normalized = email.trim().toLowerCase();
  const domain = normalized.split("@")[1];

  if (!domain) {
    return { valid: false, error: "Invalid email format." };
  }

  if (domain !== GOOGLE_WORKSPACE_DOMAIN.toLowerCase()) {
    return {
      valid: false,
      error: `Access restricted: Only institutional Google Workspace accounts (@${GOOGLE_WORKSPACE_DOMAIN}) are permitted. Personal email domains (@${domain}) cannot access MSOT Clyro.`,
    };
  }

  return { valid: true };
}

/**
 * Checks if live Google Cloud OAuth credentials are configured.
 */
export function isGoogleOAuthLive(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

/**
 * Builds the official Google OAuth 2.0 authorization URL with Google Workspace hosted domain (hd) restriction.
 */
export function getGoogleOAuthUrl(redirectUri: string, state?: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
    hd: GOOGLE_WORKSPACE_DOMAIN, // Restricts Google account selector to Workspace domain
    state: state || "clyro-msot-google-auth",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 * Format: base64(payload).base64(hmacSignature)
 */
export function signSessionToken(
  userId: string,
  email: string,
  role: string,
  authProvider: "google_workspace" | "credentials" = "credentials"
): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 7 * 24 * 60 * 60 * 1000; // 7 days

  const payload: SessionPayload = {
    userId,
    email,
    role,
    authProvider,
    issuedAt,
    expiresAt,
  };

  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadEncoded)
    .digest("base64url");

  return `${payloadEncoded}.${signature}`;
}

/**
 * Verifies the HMAC-SHA256 signature and expiration of a session token.
 * Returns null if invalid or expired.
 */
export function verifySessionToken(token: string): SessionPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadEncoded, signature] = parts;

  // Re-compute signature to verify integrity (timing-safe comparison)
  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(payloadEncoded)
    .digest("base64url");

  if (
    signature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
  ) {
    return null; // Tampered token
  }

  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(payloadEncoded, "base64url").toString("utf-8")
    );

    // Verify expiration
    if (Date.now() > payload.expiresAt) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}
