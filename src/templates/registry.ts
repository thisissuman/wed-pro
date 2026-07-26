import type { Template } from "@/types";
import type { TemplateRegistryEntry } from "./types";
import { RoyalTemplate } from "./royal/RoyalTemplate";
import { FloralEleganceTemplate } from "./floral-elegance/FloralEleganceTemplate";
import { Royal3DCinemaTemplate } from "./royal-3d-cinema/Royal3DCinemaTemplate";

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
    badge: "Bestseller",
    component: RoyalTemplate,
  },
  {
    id: "floral-elegance",
    name: "Floral Elegance",
    description:
      "Delicate botanical flourishes, warm soft paper textures, and a charming floral opener for a romantic celebration.",
    thumbnail: "/media/floral-elegance-thumbnail.png",
    category: "floral",
    badge: "New",
    component: FloralEleganceTemplate,
  },
  {
    id: "royal-3d-cinema",
    name: "Royal 3D Wedding Cinema",
    description:
      "A cinematic royal invitation with scroll-led wedding films, sacred moments, and an elegant personalised finale.",
    thumbnail: "/media/royal-3d-cinema/v1/frames/low/f_001.webp",
    category: "royal",
    badge: "Immersive",
    component: Royal3DCinemaTemplate,
  },
];

/** Marketing gallery cards — single source of truth with runtime registry. */
export function getMarketingTemplates(): Template[] {
  return registry.map(({ id, name, description, thumbnail, category, badge }) => ({
    id,
    name,
    description,
    imageUrl: thumbnail,
    category: category as Template["category"],
    badge,
  }));
}

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
