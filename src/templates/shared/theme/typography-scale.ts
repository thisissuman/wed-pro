import type { InvitationTypography } from "@/types/wedding.types";

export const TYPOGRAPHY_SCALE_OPTIONS = [
  { value: "small" as const, label: "Small", factor: 0.94 },
  { value: "default" as const, label: "Default", factor: 1 },
  { value: "large" as const, label: "Large", factor: 1.08 },
];

export function resolveTypographyScale(scale?: InvitationTypography["scale"]) {
  if (scale === "small") return TYPOGRAPHY_SCALE_OPTIONS[0];
  if (scale === "large") return TYPOGRAPHY_SCALE_OPTIONS[2];
  return TYPOGRAPHY_SCALE_OPTIONS[1];
}
