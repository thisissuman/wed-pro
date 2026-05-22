import type { TemplateRegistryEntry } from "./types";
import { RoyalTemplate } from "./royal/RoyalTemplate";

/**
 * Template Registry
 *
 * Central map of all available templates.
 * To add a new template:
 *   1. Create its folder under /templates/<name>/
 *   2. Implement the TemplateProps contract
 *   3. Register it here
 */
const registry: TemplateRegistryEntry[] = [
  {
    id: "royal",
    name: "Royal Rajputana",
    description:
      "Majestic archways, rich maroons, and intricate gold foil detailing for a grand celebration.",
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8tY2hQv7YmfTpckOrgxMKUo5jIeUSU2s8cr8zHzRt1W3CZkuLR9FWAwiwmlI2rPBvjFtonHhWV4HXaJRm6cn3LJAX_qfGgu_nuJeZpFbwFnDvaWwyaJKh_wb0S_r5bB05fxT-S5ZAwI7upnBsUlB5nwJc5XZ_pyFZbHfceSsuk0wzQRNkpaKhyHiJbz0q7YUnMwr1PUlM8zuUR-P-eCW1i5hzmrislJnzFssn1Ne0K8CIn_0omLjG5iHfU8L1qFydqZaXUtpafQM",
    category: "royal",
    component: RoyalTemplate,
  },
];

/**
 * Get a single template by ID.
 */
export function getTemplate(
  id: string
): TemplateRegistryEntry | undefined {
  return registry.find((t) => t.id === id);
}

/**
 * Get all registered templates.
 */
export function getAllTemplates(): TemplateRegistryEntry[] {
  return registry;
}
