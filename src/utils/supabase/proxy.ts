import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isProtectedApplicationPath, isPublicStaticAsset } from "@/lib/auth/session-routing";
import { getSupabaseEnv } from "./env";

/**
 * Refreshes the Supabase session on matched application requests and forwards
 * updated auth cookies to the browser. Required for Server Components and
 * long dashboard/editor sessions.
 *
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // Also guard this reusable boundary if called without the Next matcher.
  // Pass through without Supabase clients, auth cookies, redirects, or headers.
  if (isPublicStaticAsset(pathname)) return NextResponse.next({ request });
  let supabaseResponse = NextResponse.next({ request });

  const { url, anonKey } = getSupabaseEnv();
  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");

  // Supabase falls back to Site URL (/) when redirectTo is not allow-listed.
  // Forward auth params to the dedicated confirm handler before the page renders.
  if (
    pathname === "/" &&
    (code || (tokenHash && type === "recovery"))
  ) {
    const confirmUrl = request.nextUrl.clone();
    confirmUrl.pathname = "/auth/confirm";
    return redirectWithRefreshedCookies(confirmUrl, supabaseResponse);
  }

  const isProtected = isProtectedApplicationPath(pathname);

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return redirectWithRefreshedCookies(url, supabaseResponse);
  }

  if (user && (pathname === "/login" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return redirectWithRefreshedCookies(url, supabaseResponse);
  }

  return supabaseResponse;
}

function redirectWithRefreshedCookies(url: URL, supabaseResponse: NextResponse): NextResponse {
  const response = NextResponse.redirect(url);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}
