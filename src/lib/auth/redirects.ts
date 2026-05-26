/**
 * Auth redirect helpers.
 *
 * Centralises:
 *   - safe parsing of `?next=` (no open redirects)
 *   - mapping `?error=` codes to human-friendly messages
 *   - building the OAuth callback URL with `next` forwarded through
 */

export function safeNextPath(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next) return fallback;
  if (next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return fallback;
}

export function describeAuthError(code: string | null | undefined): string | null {
  if (!code) return null;
  switch (code) {
    case "auth-code-error":
      return "Sign-in could not be completed. Please try again.";
    case "expired":
      return "Your sign-in link has expired. Please sign in again.";
    default:
      return "Authentication failed. Please try again.";
  }
}

export function buildOAuthCallbackUrl(origin: string, next: string): string {
  const safe = safeNextPath(next);
  const url = new URL("/auth/callback", origin);
  if (safe !== "/dashboard") {
    url.searchParams.set("next", safe);
  }
  return url.toString();
}

export function buildLoginUrl(next?: string | null): string {
  const safe = safeNextPath(next, "/dashboard");
  if (safe === "/dashboard") {
    return "/login";
  }
  return `/login?next=${encodeURIComponent(safe)}`;
}

export function buildSignupUrl(next?: string | null): string {
  const safe = safeNextPath(next, "/dashboard");
  if (safe === "/dashboard") {
    return "/signup";
  }
  return `/signup?next=${encodeURIComponent(safe)}`;
}
