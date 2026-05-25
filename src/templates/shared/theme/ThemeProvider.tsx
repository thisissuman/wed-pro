"use client";

import type { CSSProperties, ReactNode } from "react";
import type { ThemeConfig } from "@/types/theme.types";
import { mergeThemeConfig, type TemplateThemeTokens } from "./tokens";

type ThemeStyle = CSSProperties & Record<`--template-${string}`, string>;

interface TemplateThemeProviderProps {
  children: ReactNode;
  defaultTheme: TemplateThemeTokens;
  theme?: Partial<ThemeConfig>;
  className?: string;
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
}: TemplateThemeProviderProps) {
  const tokens = mergeThemeConfig(defaultTheme, theme);

  return (
    <div className={className} style={createThemeStyle(tokens)}>
      {children}
    </div>
  );
}
