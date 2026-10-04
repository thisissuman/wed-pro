import { getOgShareImageUrl, isCloudinaryUrl } from "@/lib/media-url";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";
import type { WeddingData } from "@/types/wedding.types";

function usableImageUrl(value: string | undefined, siteUrl: string): string | undefined {
  const url = toAbsoluteUrl(value, siteUrl);
  if (!url) return undefined;
  const pathname = new URL(url).pathname;
  if (/\.(mp4|webm|mov|m4v|mp3|m4a|wav|ogg)(?:$|\/)/i.test(pathname)
    || (isCloudinaryUrl(url) && /\/(?:video|raw)\//.test(pathname))) return undefined;
  return url;
}

/** Field feedback is immediate; autosave still accepts incomplete text. */
export function getInvitationShareImageError(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  return usableImageUrl(value, getSiteUrl()) ? undefined
    : "Use a hosted HTTP(S) image URL or a local /image path, without credentials or an audio/video file.";
}

/** Explicit OG > explicit WhatsApp > hero photo > no image.
 * Use working data for next-publication previews and published data for guests.
 * Existing Cloudinary crops are retained, followed by one 1200×630 share crop.
 */
export function resolveInvitationShareImage(
  invitation: WeddingData, siteUrl = getSiteUrl(),
): string | undefined {
  const candidates = [
    invitation.seo.ogImage,
    invitation.seo.whatsappPreviewImage,
    invitation.hero.backgroundMedia,
  ];
  for (const candidate of candidates) {
    const url = usableImageUrl(candidate, siteUrl);
    if (!url) continue;
    return getOgShareImageUrl(url) || undefined;
  }
  return undefined;
}
