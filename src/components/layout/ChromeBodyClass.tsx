"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Applies body padding classes only when marketing chrome (top/bottom nav) is visible.
 */
export function ChromeBodyClass() {
  const pathname = usePathname();

  useEffect(() => {
    const isEditRoute = /\/dashboard\/invitations\/[^/]+\/edit$/.test(pathname);
    const isAuthRoute =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password" ||
      pathname === "/reset-password";
    const isPreviewRoute = pathname.startsWith("/preview/");
    const isTemplateRoute = pathname === "/template";

    const showMarketingChrome =
      !isEditRoute && !isAuthRoute && !isPreviewRoute && !isTemplateRoute;

    const showMobileBottomNav =
      showMarketingChrome && !isEditRoute;

    document.body.classList.toggle("marketing-chrome", showMarketingChrome);
    document.body.classList.toggle("mobile-nav-chrome", showMobileBottomNav);

    return () => {
      document.body.classList.remove("marketing-chrome", "mobile-nav-chrome");
    };
  }, [pathname]);

  return null;
}
