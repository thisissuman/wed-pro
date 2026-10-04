/** Stable date labels for server HTML and hydration, including unfinished drafts. */
export function formatWeddingDate(
  value: string | undefined,
  timezone = "Asia/Kolkata",
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  if (!value) return "Wedding date to be announced";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Wedding date to be announced";
  try {
    return new Intl.DateTimeFormat("en-IN", { ...options, timeZone: timezone }).format(date);
  } catch {
    return new Intl.DateTimeFormat("en-IN", { ...options, timeZone: "Asia/Kolkata" }).format(date);
  }
}
