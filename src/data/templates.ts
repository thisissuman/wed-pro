/**
 * Template gallery data — derived from the runtime registry so new templates
 * only need to be registered once in `src/templates/registry.ts`.
 */
import { getMarketingTemplates } from "@/templates/registry";

export const templates = getMarketingTemplates();
