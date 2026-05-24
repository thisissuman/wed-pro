"use client";

import type { ReactNode } from "react";

interface EditorPanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function EditorPanel({ title, description, children }: EditorPanelProps) {
  return (
    <section className="rounded-2xl border border-champagne-gold/10 bg-surface-container/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
      <div className="mb-4 space-y-1">
        <h2 className="font-heading text-lg text-champagne-gold">{title}</h2>
        {description && (
          <p className="text-xs leading-relaxed text-on-surface-variant/60">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
