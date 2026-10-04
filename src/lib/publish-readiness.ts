import type { WeddingData } from "@/types/wedding.types";

export type PublishStep = "wedding-details" | "events" | "venue" | "rsvp" | "media" | "story" | "gallery" | "share-preview";
export interface PublishIssue { path: string; step: PublishStep; message: string }
export const SAMPLE_STORY_DESCRIPTIONS = [
  "A chance encounter at a friend's Holi celebration. One conversation that turned into hours.",
  "A quiet café, two nervous hearts, and a conversation that felt like it could last forever.",
  "Under a thousand fairy lights at her favourite rooftop, he asked the question that changed everything.",
];
export const STOCK_PHOTO_IDS = ["photo-1583089892943-e02e5b017b6a", "photo-1519741497674-611481863552", "photo-1511285560929-80b456fea0bc", "photo-1606216794074-735e91aa2c92", "photo-1465495976277-4387d4b0b4c6", "photo-1522673607200-164d1b6ce486"];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const placeholders = new Set(["bride", "groom", "bride name", "groom name", "your name", "venue", "venue name", "venue address", "address", "event title"]);
export const isRealText = (value: unknown) => Boolean(text(value)) && !placeholders.has(text(value).toLowerCase());

export function isCalendarDate(value: unknown): boolean {
  const raw = text(value);
  if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$/.test(raw)) return false;
  const date = new Date(`${raw.slice(0, 10)}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === raw.slice(0, 10) && Number.isFinite(new Date(raw).getTime());
}
export function isSafeInvitationUrl(value: unknown, allowLocal = false): boolean {
  if (value != null && typeof value !== "string") return false;
  const raw = text(value);
  if (!raw) return true;
  if (/[\s\\\u0000-\u001f\u007f]/.test(raw)) return false;
  if (allowLocal && /^\/[^/]/.test(raw)) return !/^\/%(?:2f|5c)/i.test(raw);
  try {
    const url = new URL(raw);
    return (url.protocol === "https:" || url.protocol === "http:") && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
}
export function hasDemoContent(data: WeddingData): boolean {
  return (data.sections?.showStory !== false && (data.story?.timeline ?? []).some(item => SAMPLE_STORY_DESCRIPTIONS.includes(text(item.description)))) ||
    (data.gallery?.images ?? []).some(item => STOCK_PHOTO_IDS.some(id => text(item.url).includes(`images.unsplash.com/${id}`)));
}

/** Shared UI/helper contract. The database enforces equivalent rules on the saved row. */
export function validatePublishReadiness(data: WeddingData): PublishIssue[] {
  const issues: PublishIssue[] = [];
  const add = (path: string, step: PublishStep, message: string) => issues.push({ path, step, message });
  for (const side of ["bride", "groom"] as const) {
    if (!isRealText(data.couple?.[side]?.name)) add(`couple.${side}.name`, "wedding-details", `Enter the ${side}'s real name.`);
  }
  if (!isCalendarDate(data.couple?.weddingDate)) add("couple.weddingDate", "wedding-details", "Enter a real calendar date for the wedding.");
  if (!data.events?.length) add("events", "events", "Add at least one celebration with its date, time, and venue.");
  (data.events ?? []).forEach((event, index) => {
    const prefix = `events.${index}`;
    if (!isRealText(event.title)) add(`${prefix}.title`, "events", "Add a title for this event.");
    if (!isCalendarDate(event.date)) add(`${prefix}.date`, "events", "Enter a real calendar date for this event.");
    if (!/^(?:([01]?\d|2[0-3]):[0-5]\d|(0?[1-9]|1[0-2]):[0-5]\d\s*[AP]M)$/i.test(text(event.time))) add(`${prefix}.time`, "events", "Use a time such as 19:00 or 7:00 PM.");
    if (!isRealText(event.venue)) add(`${prefix}.venue`, "events", "Add this event's venue name.");
  });
  if (!isRealText(data.venue?.name)) add("venue.name", "venue", "Replace the sample venue name with your venue.");
  const coords = data.venue?.coordinates;
  const hasCoordinates = typeof coords?.lat === "number" && Number.isFinite(coords.lat) && Math.abs(coords.lat) <= 90 && typeof coords.lng === "number" && Number.isFinite(coords.lng) && Math.abs(coords.lng) <= 180;
  if (!isRealText(data.venue?.address) && !(text(data.venue?.googleMapLink) && isSafeInvitationUrl(data.venue.googleMapLink)) && !hasCoordinates) add("venue.address", "venue", "Add the venue address, a valid map link, or coordinates.");
  if (data.sections?.showRSVP !== false) {
    if (data.rsvp?.type === "whatsapp") {
      if (!/^\+?[0-9]{10,15}$/.test(text(data.rsvp.whatsappNumber).replace(/[\s-]/g, ""))) add("rsvp.whatsappNumber", "rsvp", "Add a WhatsApp number with country code (10–15 digits).");
    } else if (data.rsvp?.type !== "link" || !text(data.rsvp.formUrl) || !isSafeInvitationUrl(data.rsvp.formUrl)) add("rsvp.formUrl", "rsvp", "Add a valid HTTP or HTTPS RSVP link.");
  }
  const url = (value: unknown, path: string, step: PublishStep, local = true) => {
    if (!isSafeInvitationUrl(value, local)) add(path, step, "Use a hosted HTTP/HTTPS URL; inline data and other protocols are unsupported.");
  };
  url(data.hero?.backgroundMedia, "hero.backgroundMedia", "media");
  url(data.music?.url, "music.url", "media");
  url(data.couple?.bride?.photo, "couple.bride.photo", "wedding-details");
  url(data.couple?.groom?.photo, "couple.groom.photo", "wedding-details");
  url(data.venue?.backgroundImage, "venue.backgroundImage", "venue");
  url(data.venue?.googleMapLink, "venue.googleMapLink", "venue", false);
  url(data.rsvp?.formUrl, "rsvp.formUrl", "rsvp", false);
  url(data.seo?.ogImage, "seo.ogImage", "share-preview");
  url(data.seo?.whatsappPreviewImage, "seo.whatsappPreviewImage", "share-preview");
  (data.events ?? []).forEach((e, i) => { url(e.googleMapLink, `events.${i}.googleMapLink`, "events", false); url(e.backgroundImage, `events.${i}.backgroundImage`, "events"); });
  (data.gallery?.images ?? []).forEach((e, i) => url(e.url, `gallery.images.${i}.url`, "gallery"));
  (data.story?.timeline ?? []).forEach((e, i) => url(e.photo, `story.timeline.${i}.photo`, "story"));
  if (hasDemoContent(data) && data.demoContentAcknowledged !== true) add("demoContentAcknowledged", "gallery", "Review the sample story/stock photos. Replace them, hide/remove them, or acknowledge their use below.");
  return issues;
}

/** Strip unsupported links for rendering older saved content without rewriting its JSONB. */
export function safeInvitationForRendering(data: WeddingData): WeddingData {
  const media = (value: string | undefined) => isSafeInvitationUrl(value, true) ? value?.trim() : undefined;
  const external = (value: string | undefined) => isSafeInvitationUrl(value) ? value?.trim() : undefined;
  return { ...data, hero: { ...data.hero, backgroundMedia: media(data.hero.backgroundMedia) }, music: { ...data.music, url: media(data.music.url) },
    couple: { ...data.couple, bride: { ...data.couple.bride, photo: media(data.couple.bride.photo) }, groom: { ...data.couple.groom, photo: media(data.couple.groom.photo) } },
    venue: { ...data.venue, googleMapLink: external(data.venue.googleMapLink), backgroundImage: media(data.venue.backgroundImage) },
    rsvp: { ...data.rsvp, formUrl: external(data.rsvp.formUrl) },
    seo: { ...data.seo, ogImage: media(data.seo.ogImage), whatsappPreviewImage: media(data.seo.whatsappPreviewImage) },
    events: data.events.map(e => ({ ...e, googleMapLink: external(e.googleMapLink), backgroundImage: media(e.backgroundImage) })),
    gallery: { ...data.gallery, images: data.gallery.images.filter(e => Boolean(media(e.url))).map(e => ({ ...e, url: media(e.url)! })) },
    story: { ...data.story, timeline: data.story.timeline.map(e => ({ ...e, photo: media(e.photo) })) },
  };
}
