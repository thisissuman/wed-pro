"use client";

import { X } from "lucide-react";
import type { ReactNode, RefObject } from "react";
import { ModalSurface } from "./ModalSurface";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
  dismissible?: boolean;
  returnFocusRef?: RefObject<HTMLElement | null>;
}

export function Dialog({ open, onOpenChange, title, children, className, dismissible = true, returnFocusRef }: DialogProps) {
  return (
    <ModalSurface open={open} onOpenChange={onOpenChange} title={title} dismissible={dismissible} returnFocusRef={returnFocusRef}>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
        <button type="button" aria-label="Close dialog" tabIndex={-1} disabled={!dismissible}
          className="absolute inset-0 bg-charcoal-black/70" onClick={() => onOpenChange(false)} />
        <div className={cn(
          "relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-champagne-gold/15 bg-surface-container shadow-2xl sm:rounded-2xl",
          className)}>
          <div className="flex items-center justify-between gap-3 border-b border-champagne-gold/10 px-4 py-3">
            <h2 className="font-heading text-lg text-on-surface">{title}</h2>
            <button type="button" disabled={!dismissible} onClick={() => onOpenChange(false)}
              className="inline-flex size-11 items-center justify-center rounded-full border border-champagne-gold/20 text-champagne-gold disabled:opacity-50" aria-label="Close">
              <X size={16} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </ModalSurface>
  );
}
