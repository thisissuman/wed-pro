import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";

/** Maps editor accordion panel ids to shared template preview section DOM ids. */
export const PANEL_PREVIEW_SECTION: Record<string, string> = {
  "page-setup": PREVIEW_SECTION_IDS.hero,
  "wedding-details": PREVIEW_SECTION_IDS.hero,
  couple: PREVIEW_SECTION_IDS.couple,
  countdown: PREVIEW_SECTION_IDS.countdown,
  blessing: PREVIEW_SECTION_IDS.blessing,
  media: PREVIEW_SECTION_IDS.hero,
  events: PREVIEW_SECTION_IDS.events,
  story: PREVIEW_SECTION_IDS.story,
  gallery: PREVIEW_SECTION_IDS.gallery,
  venue: PREVIEW_SECTION_IDS.venue,
  rsvp: PREVIEW_SECTION_IDS.rsvp,
};

function getActivePreviewScrollContainer(): HTMLElement | null {
  const mobile = document.getElementById("mobile-preview-scroll-container");
  if (mobile && mobile.offsetParent !== null) {
    return mobile;
  }
  return document.getElementById("preview-scroll-container");
}

export function scrollPreviewToSection(panelId: string) {
  const targetId = PANEL_PREVIEW_SECTION[panelId];
  if (!targetId) return;

  const container = getActivePreviewScrollContainer();
  const el = document.getElementById(targetId);
  if (!container || !el) return;

  const containerTop = container.getBoundingClientRect().top;
  const elTop = el.getBoundingClientRect().top;
  const offset = elTop - containerTop + container.scrollTop;

  container.scrollTo({ top: offset, behavior: "smooth" });
}
