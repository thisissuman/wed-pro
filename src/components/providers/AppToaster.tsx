"use client";

import { Toaster } from "sonner";
import { TOAST_DURATION_MS } from "@/lib/toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      duration={TOAST_DURATION_MS}
      closeButton
      visibleToasts={2}
      toastOptions={{
        classNames: {
          toast:
            "rounded-full border border-champagne-gold/30 bg-surface-container-high text-on-surface font-[family-name:var(--font-body)] shadow-[0_8px_28px_rgba(0,0,0,0.35)] py-2.5 px-4 min-h-0 gap-1.5 text-xs [&_[data-title]]:text-champagne-gold [&_[data-description]]:text-on-surface-variant",
          title: "text-champagne-gold text-xs font-semibold",
          description: "text-on-surface-variant text-[11px]",
          success: "border-champagne-gold/40 [&_[data-icon]]:text-champagne-gold",
          error: "border-[#ffb4a8]/35 [&_[data-icon]]:text-[#ffb4a8]",
          info: "border-champagne-gold/25",
          closeButton:
            "rounded-full border-champagne-gold/25 bg-surface-container text-on-surface-variant hover:bg-champagne-gold/10 hover:text-champagne-gold",
        },
      }}
    />
  );
}
