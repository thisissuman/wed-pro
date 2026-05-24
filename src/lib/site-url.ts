/**
 * Canonical site origin for absolute OG/WhatsApp image URLs and metadataBase.
 *
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://vivaha.studio).
 * Vercel sets VERCEL_URL automatically; localhost is used in dev.
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }

  if (process.env.NODE_ENV === "production") {
    return "https://localhost";
  }

  return "http://localhost:3000";
}

/** Turn a relative or absolute media URL into an absolute URL for Open Graph. */
export function toAbsoluteUrl(path: string | undefined | null, siteUrl = getSiteUrl()): string | undefined {
  const value = path?.trim();
  if (!value) return undefined;

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return `${siteUrl}${value}`;
  }

  return `${siteUrl}/${value}`;
}
