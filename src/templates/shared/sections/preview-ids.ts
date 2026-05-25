/**
 * Canonical DOM ids used by the dashboard editor to scroll the live preview.
 *
 * Every template should apply these ids to the matching section elements.
 * Keep this file in sync with `preview-section-map.ts` when editor panels change.
 */
export const PREVIEW_SECTION_IDS = {
  hero: "preview-section-hero",
  couple: "preview-section-couple",
  countdown: "preview-section-countdown",
  events: "preview-section-events",
  story: "preview-section-story",
  gallery: "preview-section-gallery",
  venue: "preview-section-venue",
  rsvp: "preview-section-rsvp",
} as const;

export type PreviewSectionKey = keyof typeof PREVIEW_SECTION_IDS;
export type PreviewSectionId = (typeof PREVIEW_SECTION_IDS)[PreviewSectionKey];
