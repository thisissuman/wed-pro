import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { BrowserContext } from "@playwright/test";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Signs in via Supabase Auth API and seeds SSR auth cookies on the Playwright
 * context. Avoids flaky UI login where client router navigation races cookie writes.
 */
export async function seedSupabaseSession(
  context: BrowserContext,
  credentials: { email: string; password: string }
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (!url || !anonKey || url.includes("ci-placeholder")) {
    throw new Error(
      "seedSupabaseSession requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  const authClient = createClient(url, anonKey);
  const { data, error } = await authClient.auth.signInWithPassword(credentials);

  if (error || !data.session) {
    throw new Error(
      `Supabase sign-in failed: ${error?.message ?? "no session returned"}`
    );
  }

  const pendingCookies: CookieToSet[] = [];
  let resolveCookies: (() => void) | undefined;
  const cookiesReady = new Promise<void>((resolve) => {
    resolveCookies = resolve;
  });

  const serverClient = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll(cookies) {
        const withValues = cookies.filter((c) => c.value);
        if (withValues.length === 0) return;
        pendingCookies.push(...withValues);
        resolveCookies?.();
      },
    },
  });

  const { error: sessionError } = await serverClient.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });

  if (sessionError) {
    throw new Error(`Supabase setSession failed: ${sessionError.message}`);
  }

  await Promise.race([
    cookiesReady,
    new Promise<void>((_, reject) => {
      setTimeout(
        () => reject(new Error("Timed out waiting for Supabase auth cookies")),
        5_000
      );
    }),
  ]);

  const cookies = pendingCookies;
  if (cookies.length === 0) {
    throw new Error("Supabase setSession did not produce auth cookies");
  }

  const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
  const { hostname } = new URL(baseURL);

  await context.addCookies(
    cookies.map(({ name, value, options }) => ({
      name,
      value,
      path: options.path ?? "/",
      domain: hostname,
      httpOnly: options.httpOnly ?? false,
      secure: options.secure ?? false,
      sameSite: normalizeSameSite(options.sameSite),
      expires:
        typeof options.maxAge === "number"
          ? Math.floor(Date.now() / 1000) + options.maxAge
          : undefined,
    }))
  );
}

function normalizeSameSite(
  value: CookieOptions["sameSite"]
): "Lax" | "Strict" | "None" {
  if (value === "strict") return "Strict";
  if (value === "none") return "None";
  return "Lax";
}
