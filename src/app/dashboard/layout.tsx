import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Dashboard layout — defensive auth guard.
 *
 * The primary auth check lives in `src/proxy.ts` (which also refreshes the
 * Supabase session cookie). This layout is a second line of defense for
 * any path that might bypass the proxy matcher in the future.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
