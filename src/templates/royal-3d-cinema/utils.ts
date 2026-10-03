import type { CoupleData } from "@/types/wedding.types";

export function getCoupleInitials(couple: CoupleData): string {
  const firstInitial = (value: string) =>
    value.trim().split(/\s+/)[0]?.charAt(0).toUpperCase() ?? "";
  return `${firstInitial(couple.groom.name)}${firstInitial(couple.bride.name)}` || "V";
}

export function formatWeddingDate(
  value: string | undefined,
  timezone = "Asia/Kolkata",
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  if (!value) return "Wedding date to be announced";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Wedding date to be announced";

  try {
    return new Intl.DateTimeFormat("en-IN", {
      ...options,
      timeZone: timezone,
    }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-IN", options).format(date);
  }
}

export function getStructuredParentLine(
  side: "bride" | "groom",
  fatherName?: string,
  motherName?: string,
): string {
  const parents = [fatherName, motherName]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" & ");
  if (!parents) return "";
  return `${side === "bride" ? "Daughter" : "Son"} of ${parents}`;
}

export function safeExternalUrl(value: string | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;

  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

