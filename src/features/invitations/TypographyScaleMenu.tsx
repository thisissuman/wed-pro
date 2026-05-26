"use client";

import { ALargeSmall, Check, ChevronDown, Type } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TYPOGRAPHY_SCALE_OPTIONS } from "@/templates/shared/theme/typography-scale";
import type { InvitationTypography } from "@/types/wedding.types";

const ICONS = {
  small: ALargeSmall,
  default: Type,
  large: ALargeSmall,
} as const;

interface TypographyScaleMenuProps {
  value: InvitationTypography["scale"];
  onChange: (scale: NonNullable<InvitationTypography["scale"]>) => void;
}

export function TypographyScaleMenu({ value, onChange }: TypographyScaleMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const current = value ?? "default";
  const selected = TYPOGRAPHY_SCALE_OPTIONS.find((o) => o.value === current) ?? TYPOGRAPHY_SCALE_OPTIONS[1];
  const Icon = ICONS[current];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-labelledby={labelId}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-champagne-gold/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold transition hover:bg-champagne-gold/10"
      >
        <Icon size={14} className={current === "small" ? "scale-90" : current === "large" ? "scale-110" : ""} />
        <span id={labelId}>{selected.label}</span>
        <ChevronDown size={14} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[10rem] overflow-hidden rounded-xl border border-champagne-gold/15 bg-surface-container shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
        >
          {TYPOGRAPHY_SCALE_OPTIONS.map((option) => {
            const OptionIcon = ICONS[option.value];
            const isSelected = option.value === current;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex min-h-11 w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition",
                  isSelected
                    ? "bg-champagne-gold/15 text-champagne-gold"
                    : "text-on-surface-variant hover:bg-champagne-gold/10 hover:text-on-surface"
                )}
              >
                <span className="inline-flex items-center gap-2">
                  <OptionIcon size={14} />
                  {option.label}
                </span>
                {isSelected && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
