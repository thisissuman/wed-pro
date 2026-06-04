import type { TemplateThemeTokens } from "@/templates/shared/theme/tokens";

/**
 * Floral Elegance Template — default tokens.
 *
 * Dark luxury botanical palette:
 * Background: #091413 (deep forest teal)
 * Primary: #B0E4CC (mint highlight)
 * Secondary: #285A48 (medium forest green)
 * Accent: #408A71 (sage/teal)
 * Text: #e6f7f0 (mint off-white)
 */
export const floralTheme: TemplateThemeTokens = {
  colors: {
    primary: "#B0E4CC",          // Mint Highlight
    secondary: "#285A48",        // Forest Green
    accent: "#408A71",           // Sage/Teal Green
    background: "#091413",       // Rich Deep Dark Forest Teal
    surface: "#0e1c1b",          // Dark Forest Surface
    surfaceElevated: "#152927",  // Elevated Dark Surface
    text: "#e6f7f0",             // Soft Minty Off-White
    textMuted: "#8ba49a",        // Muted Sage-Gray
  },
  gradients: {
    accent: "linear-gradient(135deg, #408A71 0%, #B0E4CC 100%)",
    background: "linear-gradient(180deg, #091413 0%, #050b0a 100%)",
    fade: "linear-gradient(180deg, transparent 0%, #091413 100%)",
  },
  fonts: {
    heading: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
    body: "var(--font-body)",
  },
  spacing: {
    sectionY: "clamp(3.5rem, 8vw, 7rem)",
    containerX: "clamp(1.25rem, 6vw, 2.5rem)",
    cardRadius: "2rem",
  },
};
