"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Lightbulb, MessageSquare, User, LogOut, LayoutDashboard } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { toast } from "@/lib/toast";
import { useActiveSection } from "./ScrollTracker";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePreventSameRouteNav } from "@/hooks/usePreventSameRouteNav";

const navItems = [
  { label: "Features", icon: Sparkles, sectionId: "features" },
  { label: "How It Works", icon: Lightbulb, sectionId: "how-it-works" },
  { label: "Stories", icon: MessageSquare, sectionId: "testimonials" },
] as const;

export function BottomNavBar() {
  const { user, status, signOut } = useAuth();
  const [isStudioMenuOpen, setIsStudioMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const isHomepage = pathname === "/";
  const isAuthenticated = status === "authenticated" && Boolean(user);
  const preventSameRouteNav = usePreventSameRouteNav();

  useEffect(() => {
    if (!isStudioMenuOpen) return;
    const handler = () => setIsStudioMenuOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isStudioMenuOpen]);

  const handleSectionClick = useCallback(
    (sectionId: string) => {
      if (isHomepage) {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/#${sectionId}`);
      }
    },
    [isHomepage, router]
  );

  const handleStudioClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isAuthenticated) {
        setIsStudioMenuOpen((prev) => !prev);
      } else {
        router.push("/login");
      }
    },
    [isAuthenticated, router]
  );

  const handleSignOut = async () => {
    setIsStudioMenuOpen(false);
    await signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-2xl rounded-t-xl border-t border-champagne-gold/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[68px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isHomepage && activeSection === item.sectionId;

          return (
            <button
              key={item.label}
              onClick={() => handleSectionClick(item.sectionId)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center w-16 transition-all active:scale-90 duration-300",
                isActive
                  ? "text-champagne-gold"
                  : "text-on-surface-variant/60 hover:text-champagne-gold/80"
              )}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.5}
                className="mb-0.5"
              />
              <span
                className={cn(
                  "text-[9px] font-[family-name:var(--font-body)] uppercase tracking-widest",
                  isActive && "font-bold"
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 bg-champagne-gold rounded-full mt-0.5" />
              )}
            </button>
          );
        })}

        <div className="relative">
          <button
            onClick={handleStudioClick}
            aria-label={isAuthenticated ? "Studio menu" : "Login"}
            aria-expanded={isStudioMenuOpen}
            className={cn(
              "flex flex-col items-center justify-center w-16 transition-all active:scale-90 duration-300 relative",
              pathname === "/dashboard" || pathname === "/login" || isStudioMenuOpen
                ? "text-champagne-gold"
                : "text-on-surface-variant/60 hover:text-champagne-gold/80"
            )}
          >
            <div className="relative">
              {isAuthenticated ? (
                <div className="w-6 h-6 rounded-full bg-surface-variant border border-champagne-gold/30 flex items-center justify-center text-[10px] font-bold text-champagne-gold uppercase mb-0.5">
                  {user?.email?.[0]}
                </div>
              ) : status === "loading" ? (
                <div className="w-6 h-6 rounded-full bg-surface-variant/60 border border-champagne-gold/20 mb-0.5" />
              ) : (
                <User size={20} strokeWidth={1.5} className="mb-0.5" />
              )}
              {isAuthenticated && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-champagne-gold rounded-full border border-surface" />
              )}
            </div>
            <span className="text-[9px] font-[family-name:var(--font-body)] uppercase tracking-widest">
              {status === "loading" ? "Studio" : isAuthenticated ? "Studio" : "Login"}
            </span>
          </button>

          <AnimatePresence>
            {isStudioMenuOpen && isAuthenticated && user && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute bottom-[calc(100%+10px)] right-0 w-52 rounded-xl bg-surface-container/95 backdrop-blur-2xl border border-champagne-gold/15 p-2 shadow-[0_15px_40px_rgba(0,0,0,0.6)] origin-bottom-right text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-2 border-b border-champagne-gold/10 mb-1">
                  <p className="text-[9px] uppercase tracking-[0.1em] text-on-surface-variant/50 font-bold">
                    Logged In As
                  </p>
                  <p className="text-xs text-on-surface truncate mt-0.5 font-medium">
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/dashboard"
                  prefetch={pathname !== "/dashboard"}
                  onClick={(event) => {
                    preventSameRouteNav("/dashboard", event);
                    setIsStudioMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-xs rounded-lg text-on-surface hover:bg-champagne-gold/10 transition-colors font-medium"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>

                <button
                  onClick={() => void handleSignOut()}
                  className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-xs rounded-lg text-[#ffb4a8] hover:bg-[#8f0f07]/25 transition-colors mt-1 font-semibold"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
