/** Canonical HTTP(S) origin; configure NEXT_PUBLIC_SITE_URL for production. */
function safeOrigin(value: string | undefined): string | undefined {
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value)) return undefined;
  try {
    const url = new URL(value);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return undefined;
    return url.origin;
  } catch { return undefined; }
}

export function getSiteUrl(): string {
  return safeOrigin(process.env.NEXT_PUBLIC_SITE_URL?.trim())
    ?? safeOrigin(process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL.trim() : undefined)
    ?? (process.env.NODE_ENV === "production" ? "https://localhost" : "http://localhost:3000");
}

/** Safe hosted media or a root-relative local asset; reject other protocols. */
export function toAbsoluteUrl(path: string | undefined | null, siteUrl = getSiteUrl()): string | undefined {
  const value = path?.trim();
  if (!value || /[\u0000-\u0020\u007f\\]/.test(value)) return undefined;
  if (!/^https?:\/\//i.test(value) && (!value.startsWith("/") || value.startsWith("//"))) return undefined;
  try {
    const origin = safeOrigin(siteUrl);
    if (!origin) return undefined;
    const url = new URL(value, origin);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return undefined;
    return url.href;
  } catch { return undefined; }
}
