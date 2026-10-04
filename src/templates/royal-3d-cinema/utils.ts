import type { CoupleData } from "@/types/wedding.types";

export function getCoupleInitials(couple: CoupleData): string {
  const firstInitial = (value: string) =>
    value.trim().split(/\s+/)[0]?.charAt(0).toUpperCase() ?? "";
  return `${firstInitial(couple.groom.name)}${firstInitial(couple.bride.name)}` || "V";
}

export { formatWeddingDate } from "@/lib/format-wedding-date";

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

