/* ─── Wedding Data Schema ───
 * The single shared data structure consumed by ALL templates.
 * Templates are pure presentation layers — they receive this data and render UI.
 * This same schema will later power: editor, preview, database, and published invitations.
 *
 * File structure:
 *   wedding.types.ts  — Core wedding data (this file)
 *   animation.types.ts — Animation configuration
 *   theme.types.ts    — Theme & visual config
 */

import type { ThemeConfig } from "./theme.types";

/* ── Person (Bride or Groom) ── */
export interface PersonData {
  name: string;
  /** e.g. "Mr.", "Mrs.", "Shri", "Smt." */
  title?: string;
  parentNames?: string;
  photo?: string;
  bio?: string;
  /** Custom hero text override for cinematic reveals */
  heroText?: string;
}

/* ── Couple ── */
export interface CoupleData {
  bride: PersonData;
  groom: PersonData;
  /** Wedding date — used across hero, countdown, SEO */
  weddingDate?: string;
}

/* ── Story Timeline ── */
export interface StoryMilestone {
  id: string;
  title: string;
  date?: string;
  description: string;
  photo?: string;
}

export interface StoryData {
  /** Section heading override */
  heading?: string;
  /** Optional romantic quote displayed above timeline */
  quote?: string;
  timeline: StoryMilestone[];
}

/* ── Events ── */
export type EventType =
  | "mehendi"
  | "haldi"
  | "sangeet"
  | "wedding"
  | "reception"
  | "other";

export interface WeddingEvent {
  id: string;
  title: string;
  type: EventType;
  description?: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  googleMapLink?: string;
  /** Lat/lng for deep-linked native map apps */
  coordinates?: {
    lat: number;
    lng: number;
  };
  icon?: string;
  /** e.g. "Traditional / Ethnic Wear" */
  dressCode?: string;
  /** Background image for the event card */
  backgroundImage?: string;
}

/* ── Gallery ── */
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  /** Alt text for accessibility */
  alt?: string;
  order: number;
}

export interface GalleryData {
  /** Section heading override */
  heading?: string;
  images: GalleryImage[];
}

/* ── Venue ── */
export interface VenueData {
  name: string;
  address: string;
  /** Short description of the venue */
  description?: string;
  googleMapLink?: string;
  backgroundImage?: string;
  /** Lat/lng for future map embedding */
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/* ── Countdown ── */
export interface CountdownData {
  targetDate: string;
  /** IANA timezone string, e.g. "Asia/Kolkata" */
  timezone?: string;
  label?: string;
}

/* ── RSVP ── */
export type RSVPType = "whatsapp" | "form" | "link";

export interface RSVPData {
  type: RSVPType;
  whatsappNumber?: string;
  message?: string;
  formUrl?: string;
  /** Custom button label, e.g. "Confirm Attendance" */
  buttonText?: string;
}

/* ── Blessing ── */
export interface BlessingData {
  message: string;
  from?: string;
}

/* ── Thank You ── */
export interface ThankYouData {
  message: string;
}

/* ── Music ── */
export interface MusicData {
  url?: string;
  autoplay?: boolean;
  /** Song title for UI display */
  title?: string;
}

/* ── Hero Section Data ── */
export interface HeroData {
  /** Custom subtitle text below couple names */
  subtitle?: string;
  /** Background image or video URL */
  backgroundMedia?: string;
  /** Overlay text (e.g. "Save the Date") */
  overlayText?: string;
  /** Background overlay opacity 0-1 */
  overlayOpacity?: number;
}

/* ── SEO & Social Sharing Metadata ── */
export interface SEOData {
  /** Page <title> for published invitation */
  pageTitle?: string;
  /** Meta description for search engines */
  metaDescription?: string;
  /** OpenGraph image URL for social sharing */
  ogImage?: string;
  /** WhatsApp preview image URL */
  whatsappPreviewImage?: string;
}

/* ── Section Visibility ── */
export interface SectionVisibility {
  showHero?: boolean;
  showCouple?: boolean;
  showCountdown?: boolean;
  showBlessing?: boolean;
  showEvents?: boolean;
  showStory?: boolean;
  showGallery?: boolean;
  showVenue?: boolean;
  showRSVP?: boolean;
  showThankYou?: boolean;
}

/* ── Invitation Metadata ── */
export interface InvitationMeta {
  /** When the invitation was created */
  createdAt?: string;
  /** When the invitation was last updated */
  updatedAt?: string;
  /** When the invitation was published */
  publishedAt?: string;
  /** Owner user ID */
  userId?: string;
}

/* ── Invitation Status ── */
export type InvitationStatus = "draft" | "published";

/* ─── Root WeddingData ─── */
export interface WeddingData {
  id: string;
  slug: string;
  templateId: string;
  status: InvitationStatus;

  /* Core content sections */
  couple: CoupleData;
  hero: HeroData;
  story: StoryData;
  events: WeddingEvent[];
  gallery: GalleryData;
  venue: VenueData;
  countdown: CountdownData;
  rsvp: RSVPData;
  blessing: BlessingData;
  thankYou: ThankYouData;
  music: MusicData;

  /* Configuration */
  theme: ThemeConfig;
  seo: SEOData;
  sections: SectionVisibility;
  meta: InvitationMeta;
}

/* ─── Re-exported from separate files ─── */
export type { ThemeConfig, ThemeMode, DecorativeStyle, OverlayStyle } from "./theme.types";
export type { AnimationConfig, SectionAnimation, RevealStyle } from "./animation.types";
