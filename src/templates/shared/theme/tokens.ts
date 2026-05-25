import type { ThemeConfig } from "@/types/theme.types";

export interface TemplateThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    text: string;
    textMuted: string;
  };
  gradients: {
    accent: string;
    background: string;
    fade: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    sectionY: string;
    containerX: string;
    cardRadius: string;
  };
}

export const baseThemeTokens: TemplateThemeTokens = {
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
    accent: "linear-gradient(135deg, #d4af37 0%, #b76e79 100%)",
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

export function mergeThemeConfig(
  defaults: TemplateThemeTokens,
  override?: Partial<ThemeConfig>
): TemplateThemeTokens {
  if (!override) return defaults;

  return {
    ...defaults,
    colors: {
      ...defaults.colors,
      primary: override.primaryColor ?? defaults.colors.primary,
      secondary: override.secondaryColor ?? defaults.colors.secondary,
      accent: override.accentColor ?? defaults.colors.accent,
      background: override.backgroundColor ?? defaults.colors.background,
      text: override.textColor ?? defaults.colors.text,
    },
    gradients: {
      ...defaults.gradients,
      accent: override.accentGradient ?? defaults.gradients.accent,
      background: override.backgroundGradient ?? defaults.gradients.background,
    },
    fonts: {
      heading: override.fontHeading ?? defaults.fonts.heading,
      body: override.fontBody ?? defaults.fonts.body,
    },
    spacing: {
      ...defaults.spacing,
      sectionY: override.sectionSpacing
        ? `calc(${defaults.spacing.sectionY} * ${override.sectionSpacing})`
        : defaults.spacing.sectionY,
    },
  };
}
