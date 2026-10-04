/**
 * Media URL helpers.
 *
 * The invitation document is stored as JSONB and shared with guests on a
 * critical-path public page. We must never persist huge inline blobs
 * (`data:`, `blob:`, base64) into that column — they bloat the row and ruin
 * load time. These helpers validate and normalize URLs before they reach
 * autosave.
 */

const FORBIDDEN_PROTOCOL_PATTERN = /^(data:|blob:|javascript:|file:)/i;
const HTTPS_PATTERN = /^https?:\/\//i;

export interface MediaUrlValidation {
  ok: boolean;
  error?: string;
  cleaned?: string;
}

export function validateMediaUrl(input: string): MediaUrlValidation {
  const value = input.trim();

  if (value.length === 0) {
    return { ok: true, cleaned: "" };
  }

  if (FORBIDDEN_PROTOCOL_PATTERN.test(value)) {
    return {
      ok: false,
      error: "Inline image data is too heavy. Paste a hosted HTTPS image URL instead.",
    };
  }

  if (!HTTPS_PATTERN.test(value)) {
    return {
      ok: false,
      error: "Image URL must start with http:// or https://.",
    };
  }

  try {
    const url = new URL(value);
    return { ok: true, cleaned: url.toString() };
  } catch {
    return { ok: false, error: "That doesn't look like a valid URL." };
  }
}

/** True when a URL is safe to pass to next/image or <img src>. */
export function isValidDisplayUrl(url: string | undefined | null): boolean {
  const value = url?.trim() ?? "";
  if (value.length === 0) return false;
  return validateMediaUrl(value).ok;
}

const CLOUDINARY_HOSTS = new Set([
  "res.cloudinary.com",
  "media.cloudinary.com",
]);

export function isCloudinaryUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return CLOUDINARY_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function getCloudName(): string | undefined {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
}

export function isCloudinaryConfigured(): boolean {
  // Public cloud name enables controls; the authorization endpoint reports
  // missing server secrets/presets without exposing them to the browser.
  return Boolean(getCloudName());
}

const UPLOAD_SEGMENT = "/upload/";

/** Insert a Cloudinary transformation segment (skips if already present). */
export function withCloudinaryTransform(url: string, transformation: string): string {
  if (!isCloudinaryUrl(url) || !transformation) return url;
  if (url.includes(`${UPLOAD_SEGMENT}${transformation}/`)) return url;

  const index = url.indexOf(UPLOAD_SEGMENT);
  if (index === -1) return url;

  const prefix = url.slice(0, index + UPLOAD_SEGMENT.length);
  const suffix = url.slice(index + UPLOAD_SEGMENT.length);
  return `${prefix}${transformation}/${suffix}`;
}

/** WhatsApp / Open Graph — landscape 1.91:1 center crop from any hero aspect. */
export function getOgShareImageUrl(url: string | undefined | null): string {
  const value = url?.trim() ?? "";
  if (!value || !isValidDisplayUrl(value)) return "";
  if (!isCloudinaryUrl(value)) return value;
  const parsed = new URL(value);
  const index = parsed.pathname.indexOf(UPLOAD_SEGMENT);
  if (index === -1) return value;
  const prefix = parsed.pathname.slice(0, index + UPLOAD_SEGMENT.length);
  const segments = parsed.pathname.slice(index + UPLOAD_SEGMENT.length).split("/");
  // Delivery transformations precede v<version>/public-id. Apply the social
  // crop AFTER existing transformations so a saved portrait crop stays intact
  // and the final delivered aspect remains 1200×630.
  const transform = "c_fill,w_1200,h_630,g_auto,f_auto,q_auto";
  const isTransform = (segment: string) =>
    /^(?:(?:a|ar|b|bo|c|co|d|dl|dn|dpr|e|f|fl|fn|g|h|if|l|o|q|r|t|u|w|x|y|z)_|if_end$)/.test(segment);
  let boundary = 0;
  while (boundary < segments.length - 1 && isTransform(segments[boundary])) boundary++;
  if (segments[boundary - 1] !== transform) segments.splice(boundary, 0, transform);
  parsed.pathname = prefix + segments.join("/");
  return parsed.href;
}
