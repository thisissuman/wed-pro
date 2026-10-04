import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Explicit static namespaces/files only; app routes keep session refresh
    // even when an invitation ID or route ends in .mp4/.png. Keep aligned with
    // lib/auth/session-routing.ts. Next requires this matcher to be literal.
    "/((?!_next/static(?:/|$)|_next/image(?:/|$)|media/|tap-to-open/|(?:favicon\\.ico|window\\.svg|globe\\.svg|next\\.svg|vercel\\.svg|file\\.svg)$).*)",
  ],
};
