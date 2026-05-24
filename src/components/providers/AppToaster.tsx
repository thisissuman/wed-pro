"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      closeButton
      richColors
      toastOptions={{
        classNames: {
          toast:
            "border border-champagne-gold/20 bg-surface-container text-on-surface font-[family-name:var(--font-body)] shadow-[0_12px_40px_rgba(0,0,0,0.35)]",
          title: "text-ivory font-semibold",
          description: "text-on-surface-variant",
          success: "border-champagne-gold/30",
          error: "border-[#ffb4a8]/30",
        },
      }}
    />
  );
}
