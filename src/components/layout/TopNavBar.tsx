"use client";

import { User, ArrowRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import Link from "next/link";
import { useActiveSection } from "./ScrollTracker";

const sectionLinks = [
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Stories", id: "testimonials" },
] as const;

export function TopNavBar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const isHomepage = pathname === "/";
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = () => setIsDropdownOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isDropdownOpen]);

  const handleAvatarClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!user) {
        router.push("/login");
      } else {
        setIsDropdownOpen((prev) => !prev);
      }
    },
    [user, router]
  );

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  const toggleTheme = () => {
    const current = resolvedTheme ?? theme ?? "dark";
    setTheme(current === "dark" ? "light" : "dark");
  };

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

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-champagne-gold/10 shadow-[0_4px_30px_rgba(212,175,55,0.05)]"
    >
      <div className="flex justify-between items-center px-[var(--spacing-container-margin)] py-3 md:py-4 w-full max-w-[1200px] mx-auto">
        {/* Left: Brand Logo — always links to homepage */}
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-champagne-gold tracking-widest font-semibold text-lg md:text-headline-md shrink-0"
        >
          Vivaha Studio
        </Link>

        {/* Center: Desktop Section Links */}
        <nav className="hidden md:flex items-center gap-8">
          {sectionLinks.map((link) => {
            const isActive = isHomepage && activeSection === link.id;
            return (
              <button
                key={link.label}
                onClick={() => handleSectionClick(link.id)}
                className={cn(
                  "font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-widest transition-colors duration-300 pb-1 cursor-pointer",
                  isActive
                    ? "text-champagne-gold border-b-2 border-champagne-gold"
                    : "text-on-surface-variant hover:text-champagne-gold"
                )}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right: CTA + Avatar */}
        <div className="flex items-center gap-3 md:gap-4">
          {mounted && (
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={resolvedTheme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-champagne-gold/20 text-champagne-gold transition hover:bg-champagne-gold/10 active:scale-95"
            >
              {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <Link
            href={user ? "/dashboard" : "/template"}
            className={cn(
              "relative z-[1] inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded-full gold-gradient text-charcoal-black font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-wider hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all duration-200",
              user && "gemini-glow-btn"
            )}
          >
            {user ? "Dashboard" : "Let's Start"}
            <ArrowRight size={14} className="hidden md:inline" />
          </Link>

          {/* Profile Avatar */}
          <div className="relative hidden md:block">
            <button
              onClick={handleAvatarClick}
              aria-label="Profile"
              className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 duration-200 p-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-champagne-gold/50"
            >
              <div className="w-8 h-8 rounded-full bg-surface-variant border border-champagne-gold/20 overflow-hidden flex items-center justify-center">
                {user ? (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-champagne-gold uppercase">
                    {user.email?.[0]}
                  </div>
                ) : (
                  <User size={16} className="text-on-surface-variant" />
                )}
              </div>
            </button>

            {/* Premium Frosted Glass Profile Dropdown */}
            <AnimatePresence>
              {isDropdownOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-56 rounded-xl bg-surface-container/95 backdrop-blur-2xl border border-champagne-gold/15 p-2 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-50 origin-top-right text-left"
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
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center w-full px-3 py-2.5 text-xs rounded-lg text-on-surface hover:bg-champagne-gold/10 transition-colors font-medium"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full text-left px-3 py-2.5 text-xs rounded-lg text-[#ffb4a8] hover:bg-[#8f0f07]/25 transition-colors mt-1 font-semibold"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
