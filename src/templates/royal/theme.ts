import type { TemplateThemeTokens } from "@/templates/shared/theme/tokens";

/**
 * Royal Template — default tokens.
 *
 * `WeddingData.theme` can override these values at runtime through
 * TemplateThemeProvider. Future templates should add their own token file
 * rather than hardcoding palette and spacing in every section.
 */
export const royalTheme: TemplateThemeTokens = {
  colors: {
    primary: "#d4af37",
    secondary: "#8f0f07",
    accent: "#b76e79",
    background: "#131313",
    surface: "#1a1a1a",
    surfaceElevated: "#201f1f",
    text: "#f5f0e8",
    textMuted: "#d0c5af",
  },
  gradients: {
    accent: "linear-gradient(135deg, #d4af37, #f2ca50, #d4af37)",
    background: "linear-gradient(180deg, #5a0a05 0%, #131313 100%)",
    fade: "linear-gradient(180deg, transparent 0%, #131313 100%)",
  },
  fonts: {
    heading: "var(--font-heading)",
    body: "var(--font-body)",
  },
  spacing: {
    sectionY: "clamp(4rem, 10vw, 8rem)",
    containerX: "clamp(1rem, 5vw, 2rem)",
    cardRadius: "1.5rem",
  },
};
