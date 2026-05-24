import { sampleWeddingData } from "@/data/sample-wedding";
import type {
  GalleryImage,
  InvitationStatus,
  StoryMilestone,
  WeddingData,
  WeddingEvent,
} from "@/types/wedding.types";

export interface InvitationRow {
  id: string;
  user_id: string;
  slug: string;
  template_id: string;
  status: InvitationStatus;
  content: unknown;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

interface StarterWeddingDataInput {
  id: string;
  slug: string;
  templateId: string;
  userId: string;
  now?: string;
}

const FALLBACK_TEMPLATE_ID = "royal";

function cloneSampleWeddingData(): WeddingData {
  return JSON.parse(JSON.stringify(sampleWeddingData)) as WeddingData;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Events, gallery, and venue cannot be hidden on the public invitation. */
export function withEssentialSections(
  sections: WeddingData["sections"]
): WeddingData["sections"] {
  return {
    ...sections,
    showEvents: true,
    showGallery: true,
    showVenue: true,
  };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

/** Public URL slug from couple names, e.g. `rahul-weds-ananya`. */
export function buildInvitationSlug(groomName: string, brideName: string): string {
  const groomFirst = slugify(groomName.split(/\s+/)[0] || groomName);
  const brideFirst = slugify(brideName.split(/\s+/)[0] || brideName);

  if (groomFirst && brideFirst) {
    return `${groomFirst}-weds-${brideFirst}`.slice(0, 64);
  }
  if (groomFirst) return `${groomFirst}-wedding`.slice(0, 64);
  if (brideFirst) return `${brideFirst}-wedding`.slice(0, 64);
  return "";
}

export function resolveInvitationSlug(data: Pick<WeddingData, "slug" | "templateId" | "couple">): string {
  const fromNames = buildInvitationSlug(data.couple.groom.name, data.couple.bride.name);
  if (fromNames) return fromNames;
  if (data.slug?.trim()) return slugify(data.slug);
  return makeDraftSlug(data.templateId);
}

export function makeDraftSlug(templateId = FALLBACK_TEMPLATE_ID): string {
  const randomPart =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `${slugify(templateId || FALLBACK_TEMPLATE_ID)}-${randomPart}`;
}

function generateId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createStoryMilestone(): StoryMilestone {
  return {
    id: generateId("story"),
    title: "New Milestone",
    date: "",
    description: "",
  };
}

export const DEFAULT_GALLERY_STARTER_IMAGES: GalleryImage[] = [
  {
    id: "gal-starter-1",
    url: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=800&q=80",
    caption: "Pre-wedding shoot",
    alt: "Couple during pre-wedding photoshoot",
    order: 1,
  },
  {
    id: "gal-starter-2",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    caption: "Together forever",
    alt: "Couple holding hands",
    order: 2,
  },
  {
    id: "gal-starter-3",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
    caption: "Our journey",
    alt: "Wedding ceremony moment",
    order: 3,
  },
];

export function createGalleryImage(order: number): GalleryImage {
  return {
    id: generateId("gallery"),
    url: "",
    caption: "",
    alt: "",
    order,
  };
}

export function createDefaultWeddingEvent(date: string): WeddingEvent {
  return {
    id: generateId("event"),
    title: "Wedding Ceremony",
    type: "wedding",
    description: "Join us for the sacred wedding ceremony and blessings.",
    date,
    time: "7:00 PM",
    venue: "Venue Name",
    address: "Venue address",
    dressCode: "Traditional / Ethnic Wear",
  };
}

export function createStarterWeddingData({
  id,
  slug,
  templateId,
  userId,
  now = new Date().toISOString(),
}: StarterWeddingDataInput): WeddingData {
  const weddingDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const data = cloneSampleWeddingData();

  data.id = id;
  data.slug = slug;
  data.templateId = templateId;
  data.status = "draft";
  data.couple = {
    bride: {
      name: "Bride Name",
      parentNames: "Daughter of the family",
      bio: "A celebration of grace, joy, and new beginnings.",
      heroText: "The Bride",
    },
    groom: {
      name: "Groom Name",
      parentNames: "Son of the family",
      bio: "A celebration of love, laughter, and togetherness.",
      heroText: "The Groom",
    },
    weddingDate,
  };
  data.hero = {
    subtitle: "Together with their families, request the honour of your presence",
    overlayText: "Save the Date",
    overlayOpacity: 0.6,
  };
  data.events = [createDefaultWeddingEvent(weddingDate)];
  data.venue = {
    name: "Venue Name",
    address: "Venue address",
    description: "Add a short note about the celebration venue.",
    googleMapLink: "",
  };
  data.countdown = {
    targetDate: `${weddingDate}T19:00:00+05:30`,
    timezone: "Asia/Kolkata",
    label: "Counting Down to Forever",
  };
  data.blessing = {
    message:
      "With the blessings of our families, we invite you to celebrate this sacred union.",
    from: "With love, our families",
  };
  data.story = {
    heading: "Our Love Story",
    quote: "Every love story is beautiful, but ours is our favourite.",
    timeline: sampleWeddingData.story.timeline.map((milestone, index) => ({
      ...milestone,
      id: `story-starter-${index + 1}`,
    })),
  };
  data.gallery = {
    heading: "Our Gallery",
    images: DEFAULT_GALLERY_STARTER_IMAGES.map((img) => ({ ...img })),
  };
  data.rsvp = {
    type: "whatsapp",
    whatsappNumber: "",
    message: "We are delighted to confirm our attendance at your wedding celebration!",
    buttonText: "Confirm via WhatsApp",
  };
  data.seo = {
    pageTitle: "Wedding Invitation",
    metaDescription: "You are invited to celebrate this beautiful wedding.",
  };
  data.meta = {
    createdAt: now,
    updatedAt: now,
    userId,
  };

  return data;
}

export function normalizeInvitationRow(row: InvitationRow): WeddingData {
  const base = createStarterWeddingData({
    id: row.id,
    slug: row.slug,
    templateId: row.template_id,
    userId: row.user_id,
    now: row.created_at,
  });
  const content = isRecord(row.content) ? (row.content as Partial<WeddingData>) : {};
  const contentMeta = isRecord(content.meta) ? content.meta : {};
  const contentPublishedAt =
    typeof contentMeta.publishedAt === "string" ? contentMeta.publishedAt : undefined;

  return {
    ...base,
    ...content,
    id: row.id,
    slug: row.slug,
    templateId: row.template_id,
    status: row.status,
    sections: withEssentialSections({
      ...base.sections,
      ...(content.sections ?? {}),
    }),
    meta: {
      ...base.meta,
      ...contentMeta,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      publishedAt: row.published_at ?? contentPublishedAt,
    },
  };
}

export function getInvitationTitle(data: WeddingData): string {
  const groom = data.couple.groom.name.trim();
  const bride = data.couple.bride.name.trim();

  if (groom && bride) {
    return `${groom} & ${bride}`;
  }

  return data.seo.pageTitle || "Untitled Invitation";
}

export function getInvitationDateLabel(data: WeddingData): string {
  const rawDate = data.couple.weddingDate || data.events[0]?.date;
  if (!rawDate) {
    return "Date not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeZone: "Asia/Kolkata",
  }).format(new Date(rawDate));
}

export function getPublicInvitationPath(slug: string): string {
  return `/w/${slug}`;
}

export function getPublicInvitationUrl(slug: string, origin?: string): string {
  const path = getPublicInvitationPath(slug);
  return origin ? `${origin}${path}` : path;
}
