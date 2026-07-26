import type { WeddingData } from "@/types/wedding.types";
import { royalCinemaThemeConfig } from "./royal-3d-cinema/theme";

export const LEGACY_TEMPLATE_ID_REMAP: Readonly<Record<string, string>> = {
  "garden-mandap": "royal-3d-cinema",
};

export function resolveRegisteredTemplateId(templateId: string): string {
  return LEGACY_TEMPLATE_ID_REMAP[templateId] ?? templateId;
}

export function applyTemplateDefaults(
  data: WeddingData,
  templateId: string,
): WeddingData {
  const resolvedTemplateId = resolveRegisteredTemplateId(templateId);
  if (resolvedTemplateId !== "royal-3d-cinema") {
    return {
      ...data,
      templateId: resolvedTemplateId,
    };
  }

  return {
    ...data,
    templateId: resolvedTemplateId,
    theme: {
      ...royalCinemaThemeConfig,
    },
  };
}

