import { NextRequest, NextResponse } from "next/server";
import { googleWorkspaceAuthAction } from "@/actions/auth";
import { GOOGLE_WORKSPACE_DOMAIN } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(`Google authentication was cancelled: ${error}`)}`, appUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=Authorization+code+missing+from+Google+Workspace", appUrl)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // If live credentials are not set, return with clear guidance
    return NextResponse.redirect(
      new URL("/login?error=Google+Workspace+OAuth+credentials+not+configured+in+environment", appUrl)
    );
  }

  try {
    const redirectUri = `${appUrl}/api/auth/google/callback`;

    // 1. Exchange code for access & ID tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.id_token) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(tokenData.error_description || "Token exchange failed")}`, appUrl)
      );
    }

    // 2. Decode Google ID token payload
    const payloadBase64 = tokenData.id_token.split(".")[1];
    const googleUser = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf-8"));

    // 3. Strictly verify Google Workspace hosted domain (hd)
    if (googleUser.hd !== GOOGLE_WORKSPACE_DOMAIN && !googleUser.email.endsWith(`@${GOOGLE_WORKSPACE_DOMAIN}`)) {
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent(
            `Access restricted: Only Google Workspace accounts from @${GOOGLE_WORKSPACE_DOMAIN} are permitted.`
          )}`,
          appUrl
        )
      );
    }

    // 4. Authenticate or Just-In-Time provision via server action
    const authResult = await googleWorkspaceAuthAction(
      googleUser.email,
      googleUser.name,
      googleUser.picture
    );

    if (!authResult.success) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(authResult.error || "Authentication failed")}`, appUrl)
      );
    }

    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (err: any) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || "OAuth processing failed")}`, appUrl)
    );
  }
}
