"use client";

import { Component, type ReactNode } from "react";
import { templateRuntimes } from "./runtime-registry";
import type { WeddingData } from "@/types/wedding.types";
import { getTemplate } from "./registry";

interface TemplateRendererProps {
  templateId: string;
  data: WeddingData;
  isPreview?: boolean;
  bypassOpener?: boolean;
  suppressMusicPlayer?: boolean;
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
  bypassOpener = false,
  suppressMusicPlayer = false,
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

  const TemplateComponent = templateRuntimes[entry.id];

  return (
    <div
      className="template-renderer-shell w-full min-w-0"
      data-template-preview={isPreview || undefined}
      style={{
        containerName: "template-preview",
        containerType: "inline-size",
      }}
    >
      <TemplateRuntimeBoundary key={entry.id}>
      <TemplateComponent
        data={data}
        isPreview={isPreview}
        bypassOpener={bypassOpener}
        suppressMusicPlayer={suppressMusicPlayer}
      />
      </TemplateRuntimeBoundary>
    </div>
  );
}


class TemplateRuntimeBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return (
      <div role="alert" className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <p>This invitation could not load. Reload to try again.</p>
        <button type="button" onClick={() => window.location.reload()}
          className="min-h-11 rounded-full border border-current px-6">Reload invitation</button>
      </div>
    );
    return this.props.children;
  }
}
