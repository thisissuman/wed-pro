/**
 * Plain-text sanitization for editor fields stored in invitation JSONB.
 * Strips HTML/script payloads before they reach Supabase or public templates.
 */

const HTML_TAG_PATTERN = /<[^>]*>/g;
const SCRIPT_PATTERN = /javascript:/gi;
const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Strip unsafe content without trimming (safe while typing). */
export function sanitizePlainText(input: string): string {
  return input
    .replace(HTML_TAG_PATTERN, "")
    .replace(SCRIPT_PATTERN, "")
    .replace(CONTROL_CHARS_PATTERN, "");
}

/** Trim edges for persisted / published values. */
export function trimPlainTextField(input: string): string {
  return sanitizePlainText(input).trim();
}
