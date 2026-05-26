"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useMemo } from "react";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import { getInvitationTitle, getPublicInvitationPath } from "@/lib/invitations";
import { getSiteUrl } from "@/lib/site-url";
import { getOgShareImageUrl, isValidDisplayUrl } from "@/lib/media-url";
import type { PanelProps } from "@/features/dashboard/shared/types";

const META_MAX = 160;

export function SharePreviewPanel({ draft, update, bare }: PanelProps) {
  const sharePath = getPublicInvitationPath(draft.slug);
  const canShare = draft.status === "published";
  const siteUrl = getSiteUrl();
  const publicUrl = `${siteUrl}${sharePath}`;

  const previewTitle =
    draft.seo.pageTitle?.trim() || `${getInvitationTitle(draft)} - Wedding Invitation`;
  const previewDescription =
    draft.seo.metaDescription?.trim() ||
    `You are invited to celebrate ${getInvitationTitle(draft)}.`;
  const previewImage = useMemo(() => {
    const raw = draft.hero.backgroundMedia?.trim() || draft.seo.ogImage?.trim() || "";
    return raw ? getOgShareImageUrl(raw) : "";
  }, [draft.hero.backgroundMedia, draft.seo.ogImage]);

  const descriptionLength = (draft.seo.metaDescription ?? "").length;

  const patchSeo = (patch: Partial<typeof draft.seo>) =>
    update((current) => ({
      ...current,
      seo: { ...current.seo, ...patch },
    }));

  const content = (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#25D366]/25 bg-[#25D366]/5 p-4">
        <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#25D366]">
          <MessageCircle size={14} />
          WhatsApp link preview
        </p>
        <p className="mt-2 text-xs leading-relaxed text-on-surface-variant/70">
          This is what guests usually see when you paste your invite link in WhatsApp or Instagram.
          The image comes from your hero photo in Media &amp; Music.
        </p>

        <div className="mt-4 overflow-hidden rounded-xl border border-champagne-gold/15 bg-[var(--editor-field-bg)]">
          {isValidDisplayUrl(previewImage) ? (
            <div className="relative aspect-[1.91/1] w-full bg-surface-variant">
              <Image
                src={previewImage}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
                unoptimized={previewImage.includes("res.cloudinary.com")}
              />
            </div>
          ) : (
            <div className="flex aspect-[1.91/1] items-center justify-center bg-surface-variant/40 px-4 text-center text-xs text-on-surface-variant/50">
              Add a hero image in Media &amp; Music to see the preview here.
            </div>
          )}
          <div className="space-y-1 border-t border-champagne-gold/10 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/45">
              {canShare
                ? siteUrl.replace(/^https?:\/\//, "")
                : "Your link after publish"}
            </p>
            <p className="line-clamp-2 font-heading text-sm text-on-surface">{previewTitle}</p>
            <p className="line-clamp-2 text-xs leading-relaxed text-on-surface-variant/65">
              {previewDescription}
            </p>
          </div>
        </div>
      </div>

      <TextInput
        label="Share link title"
        value={draft.seo.pageTitle ?? ""}
        placeholder={`${getInvitationTitle(draft)} - Wedding Invitation`}
        helperText="Browser tab title and the headline in link previews."
        onChange={(value) => patchSeo({ pageTitle: value })}
      />

      <div className="space-y-2">
        <TextArea
          label="Preview description"
          value={draft.seo.metaDescription ?? ""}
          rows={3}
          placeholder="A warm one-line invite for WhatsApp and search previews."
          helperText="Keep it short and emotional — about 1–2 lines work best on mobile."
          onChange={(value) => patchSeo({ metaDescription: value })}
        />
        <p
          className={
            descriptionLength > META_MAX
              ? "text-[11px] text-[#ffb4a8]"
              : "text-[11px] text-on-surface-variant/50"
          }
        >
          {descriptionLength}/{META_MAX} characters
          {descriptionLength > META_MAX ? " — may truncate in WhatsApp" : ""}
        </p>
      </div>

      <div className="border-t border-champagne-gold/10 pt-5 space-y-3">
        {canShare ? (
          <>
            <p className="text-xs leading-relaxed text-on-surface-variant/60 break-all">{publicUrl}</p>
            <Link
              href={sharePath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold"
            >
              Open published invitation
              <ExternalLink size={14} />
            </Link>
          </>
        ) : (
          <p className="text-xs leading-relaxed text-on-surface-variant/60">
            Publish your invitation to get a shareable link. Your link is created from your couple
            names automatically.
          </p>
        )}
      </div>
    </div>
  );

  if (bare) return content;

  return (
    <EditorPanel
      title="Share Preview"
      description="Customize how your link looks when shared on WhatsApp and social apps."
    >
      {content}
    </EditorPanel>
  );
}
