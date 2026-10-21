import { NextRequest, NextResponse } from "next/server";
import { googleSignInAction } from "@/actions/auth";

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
      new URL("/login?error=Authorization+code+missing+from+Google", appUrl)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // If live credentials are not set, return with clear guidance
    return NextResponse.redirect(
      new URL("/login?error=Google+OAuth+credentials+not+configured+in+environment", appUrl)
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

    // 3. Authenticate or Just-In-Time provision via server action (supports any Google account)
    const authResult = await googleSignInAction(
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
