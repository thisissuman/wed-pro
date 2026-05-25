import type {
  BlessingData,
  CountdownData,
  CoupleData,
  GalleryData,
  HeroData,
  MusicData,
  RSVPData,
  StoryData,
  ThankYouData,
  VenueData,
  WeddingEvent,
} from "@/types/wedding.types";

export type TemplateVariant = "royal" | "floral" | "minimal";

export interface SectionVariantProps {
  variant?: TemplateVariant;
}

export interface HeroSectionContract extends SectionVariantProps {
  couple: CoupleData;
  countdown: CountdownData;
  hero: HeroData;
  weddingHashtag?: string;
}

export interface CoupleSectionContract extends SectionVariantProps {
  couple: CoupleData;
}

export interface CountdownSectionContract extends SectionVariantProps {
  countdown: CountdownData;
}

export interface BlessingSectionContract extends SectionVariantProps {
  blessing: BlessingData;
}

export interface EventsSectionContract extends SectionVariantProps {
  events: WeddingEvent[];
}

export interface StorySectionContract extends SectionVariantProps {
  story: StoryData;
}

export interface GallerySectionContract extends SectionVariantProps {
  gallery: GalleryData;
}

export interface VenueSectionContract extends SectionVariantProps {
  venue: VenueData;
}

export interface RsvpSectionContract extends SectionVariantProps {
  rsvp: RSVPData;
}

export interface ThankYouSectionContract extends SectionVariantProps {
  thankYou: ThankYouData;
  couple: CoupleData;
}

export interface MusicPlayerContract extends SectionVariantProps {
  music: MusicData;
}
