import type { WeddingData } from "@/types/wedding.types";
import { royalCinemaThemeConfig } from "./royal-3d-cinema/theme";

import { resolveRegisteredTemplateId } from "./template-ids";
export { LEGACY_TEMPLATE_ID_REMAP, resolveRegisteredTemplateId } from "./template-ids";

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

