"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ThemeConfig } from "@/types/theme.types";
import type { InvitationTypography } from "@/types/wedding.types";
import { mergeThemeConfig, type TemplateThemeTokens } from "./tokens";
import { resolveTypographyScale } from "./typography-scale";

type ThemeStyle = CSSProperties & Record<`--template-${string}`, string>;

interface TemplateThemeProviderProps {
  children: ReactNode;
  defaultTheme: TemplateThemeTokens;
  theme?: Partial<ThemeConfig>;
  className?: string;
  typographyScale?: InvitationTypography["scale"];
}

function createThemeStyle(tokens: TemplateThemeTokens): ThemeStyle {
  return {
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
      className={className}
      style={{
        ...createThemeStyle(tokens),
        ["--template-content-scale" as string]: String(scale.factor),
        zoom: scale.factor,
      }}
    >
      {children}
    </div>
  );
}
