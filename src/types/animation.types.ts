/* ─── Animation Configuration Types ───
 * Decoupled animation config so templates can support
 * different motion styles without tightly coupling to Framer Motion props.
 *
 * This config will later be editable from the dashboard.
 */

/** Reveal animation style presets */
export type RevealStyle =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale"
  | "blur"
  | "none";

/**
 * Per-section animation override.
 * Templates fall back to defaults when not specified.
 */
export interface SectionAnimation {
  /** How the section enters the viewport */
  reveal?: RevealStyle;
  /** Duration in ms (150–800 recommended) */
  duration?: number;
  /** Delay in ms before animation starts */
  delay?: number;
  /** Stagger delay between child elements in ms */
  stagger?: number;
  /** Whether to only animate once (true) or every time in view */
  once?: boolean;
}

/**
 * AnimationConfig — Global animation settings.
 *
 * Templates read this to decide reveal style, timing, and transitions.
 * Individual sections can override via their own SectionAnimation.
 */
export interface AnimationConfig {
  /** Master toggle — disable all animations (e.g. for low-end devices) */
  enabled?: boolean;
  /** Default reveal style for all sections */
  defaultReveal?: RevealStyle;
  /** Default duration in ms */
  defaultDuration?: number;
  /** Default stagger in ms */
  defaultStagger?: number;
  /** Per-section overrides keyed by section name */
  sections?: {
    hero?: SectionAnimation;
    couple?: SectionAnimation;
    countdown?: SectionAnimation;
    blessing?: SectionAnimation;
    events?: SectionAnimation;
    story?: SectionAnimation;
    gallery?: SectionAnimation;
    venue?: SectionAnimation;
    rsvp?: SectionAnimation;
    thankYou?: SectionAnimation;
  };
}
