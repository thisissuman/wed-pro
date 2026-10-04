"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ThemeConfig } from "@/types/theme.types";
import type { InvitationTypography } from "@/types/wedding.types";
import { mergeThemeConfig, type TemplateThemeTokens } from "./tokens";
import { resolveTypographyScale } from "./typography-scale";

type ThemeStyle = CSSProperties & Record<`--${string}`, string>;

interface TemplateThemeProviderProps {
  children: ReactNode;
  defaultTheme: TemplateThemeTokens;
  theme?: Partial<ThemeConfig>;
  className?: string;
  typographyScale?: InvitationTypography["scale"];
}

function createThemeStyle(tokens: TemplateThemeTokens): ThemeStyle {
  return {
    // Legacy semantic utilities are scoped to this invitation, never the studio mode.
    "--color-background": tokens.colors.background,
    "--color-surface": tokens.colors.surface,
    "--color-surface-container": tokens.colors.surface,
    "--color-surface-container-high": tokens.colors.surfaceElevated,
    "--color-on-surface": tokens.colors.text,
    "--color-on-surface-variant": tokens.colors.textMuted,
    "--color-ivory": tokens.colors.text,
    "--color-champagne-gold": tokens.colors.primary,
    "--color-charcoal-black": "#131313",
    "--template-on-image": "#fffdf9",
    "--template-on-image-muted": "#e8e3dc",
    "--template-primary": tokens.colors.primary,
    "--template-secondary": tokens.colors.secondary,
    "--template-accent": tokens.colors.accent,
    "--template-background": tokens.colors.background,
    "--template-surface": tokens.colors.surface,
    "--template-surface-elevated": tokens.colors.surfaceElevated,
    "--template-text": tokens.colors.text,
    "--template-text-muted": tokens.colors.textMuted,
    "--template-gradient-accent": tokens.gradients.accent,
    "--template-gradient-background": tokens.gradients.background,
    "--template-gradient-fade": tokens.gradients.fade,
    "--template-font-heading": tokens.fonts.heading,
    "--template-font-body": tokens.fonts.body,
    "--template-section-y": tokens.spacing.sectionY,
    "--template-container-x": tokens.spacing.containerX,
    "--template-card-radius": tokens.spacing.cardRadius,
  };
}

export function TemplateThemeProvider({
  children,
  defaultTheme,
  theme,
  className,
  typographyScale = "default",
}: TemplateThemeProviderProps) {
  const tokens = mergeThemeConfig(defaultTheme, theme);
  const scale = resolveTypographyScale(typographyScale);

  return (
    <div
      className={["template-theme", className].filter(Boolean).join(" ")}
      style={{
        ...createThemeStyle(tokens),
        ["--template-content-scale" as string]: String(scale.factor),
        zoom: scale.factor,
        colorScheme: "dark",
      }}
    >
      {children}
    </div>
  );
}
