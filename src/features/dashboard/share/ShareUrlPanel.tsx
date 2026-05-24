"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextInput } from "@/features/dashboard/shared/Inputs";
import { getPublicInvitationPath, slugify } from "@/lib/invitations";
import type { PanelProps } from "@/features/dashboard/shared/types";

export function ShareUrlPanel({ draft, update, bare }: PanelProps) {
  const sharePath = getPublicInvitationPath(draft.slug);
  const canShare = draft.status === "published";

  const content = (
    <>
      <TextInput
        label="Slug"
        value={draft.slug}
        onChange={(value) =>
          update((current) => ({
            ...current,
            slug: slugify(value),
          }))
        }
      />
      <p className="text-xs leading-relaxed text-on-surface-variant/60">{sharePath}</p>
      {canShare && (
        <Link
          href={sharePath}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold"
        >
          Open public invitation
          <ExternalLink size={14} />
        </Link>
      )}
    </>
  );

  if (bare) return <div className="space-y-4">{content}</div>;

  return <EditorPanel title="Share URL">{content}</EditorPanel>;
}
