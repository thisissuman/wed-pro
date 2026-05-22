/* ─── Theme Configuration Types ───
 * Visual customization for templates.
 * Supports colors, typography, gradients, spacing, and decorative styles.
 * Consumed by templates for dynamic theming — avoid hardcoded styles.
 */

/** Decorative style presets */
export type DecorativeStyle = "floral" | "geometric" | "minimal" | "royal";

/** Theme mode */
export type ThemeMode = "dark" | "light";

/** Overlay style for hero and section backgrounds */
export interface OverlayStyle {
  /** CSS color or gradient for the overlay */
  color?: string;
  /** Opacity 0-1 */
  opacity?: number;
  /** Blur amount in px */
  blur?: number;
}

/**
 * ThemeConfig — Template visual identity.
 *
 * Every template reads these values to render colors, fonts, and spacing.
 * This config will later be editable from the dashboard.
 */
export interface ThemeConfig {
  /* ── Colors ── */
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;

  /* ── Typography ── */
  fontHeading?: string;
  fontBody?: string;

  /* ── Gradients ── */
  accentGradient?: string;
  /** Background gradient for sections */
  backgroundGradient?: string;

  /* ── Decorative ── */
  decorativeStyle?: DecorativeStyle;

  /* ── Overlay ── */
  overlayStyle?: OverlayStyle;

  /* ── Spacing ── */
  /** Section gap multiplier (1 = default, 1.5 = spacious, 0.75 = compact) */
  sectionSpacing?: number;

  /* ── Mode ── */
  mode?: ThemeMode;
}
