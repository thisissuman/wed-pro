/**
 * Public Supabase env for browser and server clients.
 *
 * GitHub Actions sets `CI=true` but does not load `.env.local`. When secrets are
 * unset, we use placeholders so `next build` can prerender pages that mount
 * AuthProvider. Add real `NEXT_PUBLIC_SUPABASE_*` repo secrets for auth E2E.
 */
const CI_PLACEHOLDER_URL = "https://ci-placeholder.supabase.co";
/** Supabase demo anon JWT — compile-only; not a real project. */
const CI_PLACEHOLDER_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

export function getSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  if (url && anonKey) {
    return { url, anonKey };
  }

  const isCi =
    process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
  if (isCi) {
    return { url: CI_PLACEHOLDER_URL, anonKey: CI_PLACEHOLDER_ANON_KEY };
  }

  throw new Error(
    "@supabase/ssr: Your project's URL and API key are required to create a Supabase client! " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (local) " +
      "or GitHub Actions secrets (CI)."
  );
}
