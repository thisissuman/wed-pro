"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Lightbulb, MessageSquare, User } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState, useCallback } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter, usePathname } from "next/navigation";
import { useActiveSection } from "./ScrollTracker";

const navItems = [
  { label: "Features", icon: Sparkles, sectionId: "features" },
  { label: "How It Works", icon: Lightbulb, sectionId: "how-it-works" },
  { label: "Stories", icon: MessageSquare, sectionId: "testimonials" },
] as const;

export function BottomNavBar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const isHomepage = pathname === "/";

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const handleAvatarClick = useCallback(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface/90 backdrop-blur-2xl rounded-t-xl border-t border-champagne-gold/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[68px] px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isHomepage && activeSection === item.sectionId;

          const handleClick = () => {
            handleSectionClick(item.sectionId);
          };

          return (
            <button
              key={item.label}
              onClick={handleClick}
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

        {/* Login / Dashboard Avatar */}
        <button
          onClick={handleAvatarClick}
          aria-label={user ? "Dashboard" : "Login"}
          className={cn(
            "flex flex-col items-center justify-center w-16 transition-all active:scale-90 duration-300 relative",
            pathname === "/dashboard" || pathname === "/login"
              ? "text-champagne-gold"
              : "text-on-surface-variant/60 hover:text-champagne-gold/80"
          )}
        >
          <div className="relative">
            {user ? (
              <div className="w-6 h-6 rounded-full bg-surface-variant border border-champagne-gold/30 flex items-center justify-center text-[10px] font-bold text-champagne-gold uppercase mb-0.5">
                {user.email?.[0]}
              </div>
            ) : (
              <User size={20} strokeWidth={1.5} className="mb-0.5" />
            )}
            {/* Authenticated indicator dot */}
            {user && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-champagne-gold rounded-full border border-surface" />
            )}
          </div>
          <span className="text-[9px] font-[family-name:var(--font-body)] uppercase tracking-widest">
            {user ? "Studio" : "Login"}
          </span>
        </button>
      </div>
    </nav>
  );
}
