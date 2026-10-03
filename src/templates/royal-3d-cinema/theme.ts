import type { TemplateThemeTokens } from "@/templates/shared/theme/tokens";
import type { ThemeConfig } from "@/types/theme.types";

export const royalCinemaThemeConfig: ThemeConfig = {
  primaryColor: "#A8782C",
  secondaryColor: "#6B1124",
  accentColor: "#C49A46",
  backgroundColor: "#FBF4E6",
  textColor: "#251610",
  decorativeStyle: "royal",
  mode: "light",
  accentGradient:
    "linear-gradient(135deg, #7A4E16 0%, #D6B56C 48%, #8C5D1C 100%)",
  backgroundGradient:
    "linear-gradient(180deg, #FFF9EE 0%, #F6E8CD 50%, #FFF9EE 100%)",
  overlayStyle: {
    color: "#210B12",
    opacity: 0.48,
  },
};

export const royalCinemaTheme: TemplateThemeTokens = {
  colors: {
    primary: royalCinemaThemeConfig.primaryColor,
    secondary: royalCinemaThemeConfig.secondaryColor,
    accent: royalCinemaThemeConfig.accentColor ?? "#C49A46",
    background: royalCinemaThemeConfig.backgroundColor ?? "#FBF4E6",
    surface: "#FFF9EE",
    surfaceElevated: "#F2E2C3",
    text: royalCinemaThemeConfig.textColor ?? "#251610",
    textMuted: "#655047",
  },
  gradients: {
    accent: royalCinemaThemeConfig.accentGradient ?? "",
    background: royalCinemaThemeConfig.backgroundGradient ?? "",
    fade:
      "linear-gradient(180deg, rgba(251,244,230,0) 0%, #FBF4E6 100%)",
  },
  fonts: {
    heading: "var(--font-heading)",
    body: "var(--font-body)",
  },
  spacing: {
    sectionY: "clamp(4.5rem, 10cqw, 8rem)",
    containerX: "clamp(1rem, 5cqw, 2rem)",
    cardRadius: "1.75rem",
  },
};
