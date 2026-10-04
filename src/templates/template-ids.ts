export const LEGACY_TEMPLATE_ID_REMAP: Readonly<Record<string, string>> = {
  "garden-mandap": "royal-3d-cinema",
};

export function resolveRegisteredTemplateId(templateId: string): string {
  return LEGACY_TEMPLATE_ID_REMAP[templateId] ?? templateId;
}
