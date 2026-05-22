/* ─── Template Types ─── */
export interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: TemplateCategory;
  badge?: string;
}

export type TemplateCategory =
  | "all"
  | "royal"
  | "modern"
  | "floral"
  | "minimal";

/* ─── Feature Types ─── */
export interface Feature {
  id: string;
  icon: string;
  label: string;
  description: string;
  badge?: string;
}

/* ─── Testimonial Types ─── */
export interface Testimonial {
  id: string;
  quote: string;
  coupleName: string;
  rating: number;
}

/* ─── Navigation Types ─── */
export interface NavItem {
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

/* ─── Comparison Types ─── */
export interface ComparisonItem {
  text: string;
  available: boolean;
}

/* ─── Wedding Data Types (re-exported) ─── */
export type {
  PersonData,
  CoupleData,
  StoryMilestone,
  StoryData,
  EventType,
  WeddingEvent,
  GalleryImage,
  GalleryData,
  VenueData,
  CountdownData,
  RSVPType,
  RSVPData,
  BlessingData,
  ThankYouData,
  MusicData,
  HeroData,
  SEOData,
  SectionVisibility,
  InvitationMeta,
  InvitationStatus,
  WeddingData,
} from "./wedding.types";

/* ─── Theme Types (re-exported) ─── */
export type {
  ThemeConfig,
  ThemeMode,
  DecorativeStyle,
  OverlayStyle,
} from "./theme.types";

/* ─── Animation Types (re-exported) ─── */
export type {
  AnimationConfig,
  SectionAnimation,
  RevealStyle,
} from "./animation.types";
