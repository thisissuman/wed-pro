/**
 * Editor field validation helpers (display-only; autosave still stores sanitized text).
 */

export interface FieldValidation {
  ok: boolean;
  message?: string;
}

const HASHTAG_PATTERN = /^#?[A-Za-z0-9_]{0,32}$/;
const WHATSAPP_PATTERN = /^\+?[0-9]{10,15}$/;

export function validateHashtag(value: string): FieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { ok: true };
  if (!HASHTAG_PATTERN.test(trimmed)) {
    return {
      ok: false,
      message: "Use letters, numbers, or underscores only (max 32 characters).",
    };
  }
  return { ok: true };
}

export function validateWhatsAppNumber(value: string): FieldValidation {
  const normalized = value.replace(/[\s-]/g, "");
  if (normalized.length === 0) return { ok: true };
  if (!WHATSAPP_PATTERN.test(normalized)) {
    return {
      ok: false,
      message: "Use 10–15 digits with optional + country code, no spaces.",
    };
  }
  return { ok: true };
}

export function validateWeddingDate(value: string): FieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return { ok: false, message: "Wedding date is required." };
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return { ok: false, message: "Enter a valid date (YYYY-MM-DD)." };
  }
  return { ok: true };
}

export function validateHttpsUrl(value: string): FieldValidation {
  const trimmed = value.trim();
  if (trimmed.length === 0) return { ok: true };
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { ok: false, message: "Link must use http:// or https://." };
    }
    return { ok: true };
  } catch {
    return { ok: false, message: "Enter a valid URL." };
  }
}
