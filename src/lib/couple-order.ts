import type { CoupleData, CoupleFamilyData, PersonData } from "@/types/wedding.types";

export interface OrderedPerson {
  person: PersonData;
  role: "bride" | "groom";
}

/** Returns couple members in display order for hero, thank-you, etc. */
export function getOrderedCoupleMembers(
  couple: CoupleData,
  family?: CoupleFamilyData | null
): [OrderedPerson, OrderedPerson] {
  const brideFirst = family?.displayOrder === "bride-first";
  if (brideFirst) {
    return [
      { person: couple.bride, role: "bride" },
      { person: couple.groom, role: "groom" },
    ];
  }
  return [
    { person: couple.groom, role: "groom" },
    { person: couple.bride, role: "bride" },
  ];
}

export function firstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}
