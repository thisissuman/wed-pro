"use client";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

/** Prevent Next.js client navigations that re-fetch RSC payloads for the current route. */
export function usePreventSameRouteNav() {
  const pathname = usePathname();

  return useCallback(
    (href: string, event: React.MouseEvent<HTMLAnchorElement>) => {
      const targetPath = href.split("#")[0]?.split("?")[0] || "/";
      if (targetPath === pathname) {
        event.preventDefault();
      }
    },
    [pathname]
  );
}
