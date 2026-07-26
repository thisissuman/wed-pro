import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { sampleWeddingData } from "@/data/sample-wedding";
import { getTemplate } from "@/templates/registry";
import { applyTemplateDefaults } from "@/templates/template-defaults";
import type { Metadata } from "next";

interface PreviewPageProps {
  params: Promise<{ templateId: string }>;
}

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const { templateId } = await params;
  const template = getTemplate(templateId);

  return {
    title: template
      ? `${template.name} — Preview | Vivaha Studio`
      : "Template Preview | Vivaha Studio",
    description: template?.description ?? "Preview a wedding invitation template.",
  };
}

/**
 * Template Preview Route
 *
 * Renders a full-screen template preview with sample data.
 * No navigation chrome — the template takes the entire viewport.
 *
 * Usage: /preview/royal
 */
export default async function PreviewPage({ params }: PreviewPageProps) {
  const { templateId } = await params;

  // Override the sample data's templateId with the requested one
  const previewData = applyTemplateDefaults(
    {
      ...sampleWeddingData,
      templateId,
    },
    templateId,
  );

  return <TemplateRenderer templateId={templateId} data={previewData} isPreview />;
}
