import type { WeddingData } from "@/types/wedding.types";

/**
 * The contract every template component must implement.
 * Templates are pure presentation layers — they receive data and render UI.
 */
export interface TemplateProps {
  /** The full wedding data to render */
  data: WeddingData;
  /** True when rendering inside the editor preview panel */
  isPreview?: boolean;
}

/**
 * Metadata for a registered template.
 * Used by the template listing page and the registry.
 */
export interface TemplateRegistryEntry {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  badge?: string;
  component: React.ComponentType<TemplateProps>;
}
