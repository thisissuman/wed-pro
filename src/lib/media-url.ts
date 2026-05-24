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

export function getUploadPreset(): string | undefined {
  return process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(getCloudName() && getUploadPreset());
}
