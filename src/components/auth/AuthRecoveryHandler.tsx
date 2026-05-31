"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Supabase recovery emails may land on the site root (Site URL) with hash tokens
 * when the callback URL is missing from the allow list. Forward those sessions
 * to the reset-password screen before the hash is stripped by navigation.
 */
export function AuthRecoveryHandler() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname === "/reset-password" || pathname === "/auth/confirm") return;

    const { hash, search } = window.location;

    if (hash.includes("type=recovery")) {
      window.location.replace(`/reset-password${hash}`);
      return;
    }

    const params = new URLSearchParams(search);
    if (params.get("type") === "recovery" && (params.get("token_hash") || params.get("code"))) {
      window.location.replace(`/auth/confirm?${params.toString()}`);
      return;
    }
  }, [pathname]);

  return null;
}
