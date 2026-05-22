/**
 * Royal Template — Theme Configuration
 *
 * Visual identity for the Royal Rajputana template.
 * Sections can import these values instead of hardcoding colors.
 */
export const royalTheme = {
  colors: {
    gold: "#d4af37",
    goldLight: "#f2ca50",
    goldDim: "#b8962e",
    maroon: "#8f0f07",
    maroonDeep: "#5a0a05",
    ivory: "#f5f0e8",
    cream: "#e5e2e1",
    charcoal: "#131313",
    surface: "#1a1a1a",
    surfaceElevated: "#201f1f",
  },
  gradients: {
    gold: "linear-gradient(135deg, #d4af37, #f2ca50, #d4af37)",
    maroonToBlack: "linear-gradient(180deg, #5a0a05 0%, #131313 100%)",
    darkFade: "linear-gradient(180deg, transparent 0%, #131313 100%)",
  },
  fonts: {
    heading: "Playfair Display",
    body: "Inter",
  },
  spacing: {
    sectionGap: "clamp(4rem, 10vw, 8rem)",
    containerPadding: "clamp(1rem, 5vw, 2rem)",
  },
} as const;
