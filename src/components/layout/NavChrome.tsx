"use client";

import { usePathname } from "next/navigation";
import { TopNavBar } from "./TopNavBar";
import { BottomNavBar } from "./BottomNavBar";

interface NavChromeProps {
  hideMobileChrome?: boolean;
}

export function NavChrome({ hideMobileChrome = false }: NavChromeProps) {
  const pathname = usePathname();
  const isEditRoute = /\/dashboard\/invitations\/[^/]+\/edit$/.test(pathname);
  const hideBottomOnMobile = hideMobileChrome || isEditRoute;

  return (
    <>
      {!isEditRoute && <TopNavBar />}
      <div className={hideBottomOnMobile ? "hidden md:block" : undefined}>
        <BottomNavBar />
      </div>
    </>
  );
}
