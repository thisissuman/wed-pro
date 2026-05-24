"use client";

import { Toaster } from "sonner";
import { TOAST_DURATION_MS } from "@/lib/toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      duration={TOAST_DURATION_MS}
      closeButton
      richColors
      visibleToasts={2}
      toastOptions={{
        classNames: {
          toast:
            "rounded-full border border-champagne-gold/20 bg-surface-container text-on-surface font-[family-name:var(--font-body)] shadow-[0_8px_24px_rgba(0,0,0,0.3)] py-2 px-3.5 min-h-0 gap-1.5 text-xs",
          title: "text-ivory text-xs font-semibold",
          description: "text-on-surface-variant text-[11px]",
          success: "border-champagne-gold/30",
          error: "border-[#ffb4a8]/30",
          closeButton:
            "border-champagne-gold/20 bg-surface-container text-on-surface-variant hover:bg-champagne-gold/10",
        },
      }}
    />
  );
}
