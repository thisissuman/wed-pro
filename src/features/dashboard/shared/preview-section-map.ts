/** Maps editor accordion panel ids to Royal template preview section DOM ids. */
export const PANEL_PREVIEW_SECTION: Record<string, string> = {
  "page-setup": "preview-section-hero",
  "wedding-details": "preview-section-hero",
  couple: "preview-section-couple",
  countdown: "preview-section-countdown",
  media: "preview-section-hero",
  events: "preview-section-events",
  story: "preview-section-story",
  gallery: "preview-section-gallery",
  venue: "preview-section-venue",
  rsvp: "preview-section-rsvp",
};

export function scrollPreviewToSection(panelId: string) {
  const targetId = PANEL_PREVIEW_SECTION[panelId];
  if (!targetId) return;

  const container = document.getElementById("preview-scroll-container");
  const el = document.getElementById(targetId);
  if (!container || !el) return;

  const containerTop = container.getBoundingClientRect().top;
  const elTop = el.getBoundingClientRect().top;
  const offset = elTop - containerTop + container.scrollTop;

  container.scrollTo({ top: offset, behavior: "smooth" });
}
