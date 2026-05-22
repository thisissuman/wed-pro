"use client";

import type { WeddingData } from "@/types/wedding.types";
import { getTemplate } from "./registry";

interface TemplateRendererProps {
  templateId: string;
  data: WeddingData;
  isPreview?: boolean;
}

/**
 * TemplateRenderer
 *
 * Stateless component that resolves the correct template from the registry
 * and renders it with the provided wedding data.
 *
 * Usage:
 *   <TemplateRenderer templateId="royal" data={weddingData} />
 */
export function TemplateRenderer({
  templateId,
  data,
  isPreview = false,
}: TemplateRendererProps) {
  const entry = getTemplate(templateId);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="text-center space-y-4 p-8">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl text-champagne-gold">
            Template Not Found
          </h1>
          <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant">
            The template &quot;{templateId}&quot; could not be found.
          </p>
        </div>
      </div>
    );
  }

  const TemplateComponent = entry.component;

  return <TemplateComponent data={data} isPreview={isPreview} />;
}
