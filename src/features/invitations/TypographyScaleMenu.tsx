"use client";

import { ALargeSmall, ChevronDown, Type } from "lucide-react";
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
  const current = value ?? "default";
  const Icon = ICONS[current];
  return (
    <div className="relative inline-flex items-center">
      <Icon aria-hidden size={14} className="pointer-events-none absolute left-3 text-champagne-gold" />
      <select aria-label="Invitation text size" value={current}
        onChange={(event) => onChange(event.target.value as NonNullable<InvitationTypography["scale"]>)}
        className="min-h-11 appearance-none rounded-full border border-champagne-gold/20 bg-surface-container py-2 pl-9 pr-8 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne-gold">
        {TYPOGRAPHY_SCALE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown aria-hidden size={14} className="pointer-events-none absolute right-3 text-champagne-gold" />
    </div>
  );
}
