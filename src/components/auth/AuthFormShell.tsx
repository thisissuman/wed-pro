"use client";

import type { ReactNode } from "react";

interface AuthFormShellProps {
  tagline: string;
  children: ReactNode;
  footer: ReactNode;
}

/**
 * Shared auth page layout — no marketing nav padding; mobile-safe scroll.
 */
export function AuthFormShell({ tagline, children, footer }: AuthFormShellProps) {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-grow flex-col items-center px-4 pb-8 pt-[max(1rem,env(safe-area-inset-top))] sm:px-6 min-h-dvh overflow-y-auto">
      <div className="mb-6 shrink-0 text-center sm:mb-8">
        <h1 className="font-heading text-3xl font-semibold uppercase tracking-[0.2em] text-[#f2ca50] drop-shadow-lg sm:text-4xl md:text-5xl md:tracking-[0.25em]">
          Vivaha Studio
        </h1>
        <p className="mt-3 font-body text-xs uppercase tracking-[0.25em] text-[#d0c5af]/80 sm:text-sm sm:tracking-[0.3em]">
          {tagline}
        </p>
      </div>

      {children}

      <div className="mt-6 shrink-0 pb-[env(safe-area-inset-bottom)] text-center sm:mt-8">
        {footer}
      </div>
    </main>
  );
}

export function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#f2ca50]/15 bg-[#201f1f]/50 p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-500 hover:border-[#f2ca50]/25 md:p-10 md:backdrop-blur-2xl">
      <div className="absolute top-0 left-1/2 h-[2px] w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#f2ca50]/30 to-transparent" />
      {children}
    </div>
  );
}
