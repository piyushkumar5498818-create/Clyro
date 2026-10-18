import crypto from "crypto";

const AUTH_SECRET = process.env.AUTH_SECRET || "clyro-mirai-session-secret-2024-msot";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  issuedAt: number;
  expiresAt: number;
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 * Format: base64(payload).base64(hmacSignature)
 */
export function signSessionToken(userId: string, email: string, role: string): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 7 * 24 * 60 * 60 * 1000; // 7 days

  const payload: SessionPayload = {
    userId,
    email,
    role,
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
