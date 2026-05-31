import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

function resolveRedirectOrigin(request: Request, origin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) return origin;
  if (forwardedHost) return `https://${forwardedHost}`;
  return origin;
}

/**
 * Server-side handler for Supabase email links (password recovery, etc.).
 * Register this exact path in Supabase → Auth → Redirect URLs.
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const redirectOrigin = resolveRedirectOrigin(request, requestUrl.origin);
  const resetPasswordUrl = `${redirectOrigin}/reset-password`;
  const forgotPasswordUrl = new URL("/forgot-password", redirectOrigin);

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(resetPasswordUrl);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    });

    if (!error) {
      return NextResponse.redirect(resetPasswordUrl);
    }
  }

  forgotPasswordUrl.searchParams.set("error", "expired");
  return NextResponse.redirect(forgotPasswordUrl);
}
