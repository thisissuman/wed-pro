"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { CloudinaryUploadField } from "@/components/media/CloudinaryUploadField";
import { EditorPanel } from "@/features/dashboard/shared/EditorPanel";
import { TextArea, TextInput } from "@/features/dashboard/shared/Inputs";
import { ToggleRow } from "@/features/dashboard/shared/ToggleRow";
import {
  getInvitationTitle,
  getPublicInvitationPath,
  slugify,
} from "@/lib/invitations";
import { getSiteUrl } from "@/lib/site-url";
import { isSlugAvailable, findAvailableSlug } from "@/lib/publish";
import { isValidDisplayUrl } from "@/lib/media-url";
import type { PanelProps } from "@/features/dashboard/shared/types";

const META_MAX = 160;

export function SharePreviewPanel({ draft, update, bare }: PanelProps) {
  const [useSameWhatsAppImage, setUseSameWhatsAppImage] = useState(
    () =>
      !draft.seo.whatsappPreviewImage ||
      draft.seo.whatsappPreviewImage === draft.seo.ogImage
  );

  const [slugTaken, setSlugTaken] = useState(false);
  const [suggestedSlug, setSuggestedSlug] = useState<string | null>(null);

  useEffect(() => {
    const normalized = slugify(draft.slug);
    const timeout = window.setTimeout(() => {
      if (!normalized) {
        setSlugTaken(false);
        setSuggestedSlug(null);
        return;
      }

      const supabase = createClient();
      void (async () => {
        try {
          const available = await isSlugAvailable(supabase, normalized, draft.id);
          setSlugTaken(!available);
          if (!available) {
            const next = await findAvailableSlug(supabase, normalized, draft.id);
            setSuggestedSlug(next);
          } else {
            setSuggestedSlug(null);
          }
        } catch {
          setSlugTaken(false);
          setSuggestedSlug(null);
        }
      })();
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [draft.slug, draft.id]);

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
    const primary = draft.seo.ogImage?.trim();
    const whatsapp = draft.seo.whatsappPreviewImage?.trim();
    const image = useSameWhatsAppImage ? primary || whatsapp : whatsapp || primary;
    return image || draft.hero.backgroundMedia?.trim() || "";
  }, [
    draft.seo.ogImage,
    draft.seo.whatsappPreviewImage,
    draft.hero.backgroundMedia,
    useSameWhatsAppImage,
  ]);

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
          Publish first, then share the public URL.
        </p>
        {(siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")) && (
          <p className="mt-2 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-[11px] leading-relaxed text-amber-100/90">
            WhatsApp cannot load previews from localhost. Set{" "}
            <code className="text-champagne-gold">NEXT_PUBLIC_SITE_URL</code> to your production URL
            (e.g. https://wed-pro.vercel.app), publish, then test the share link again.
          </p>
        )}

        <div className="mt-4 overflow-hidden rounded-xl border border-champagne-gold/15 bg-charcoal-black/60">
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
              Upload a share image (1200×630 recommended)
            </div>
          )}
          <div className="space-y-1 border-t border-champagne-gold/10 px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/45">
              {siteUrl.replace(/^https?:\/\//, "")}
            </p>
            <p className="line-clamp-2 font-heading text-sm text-ivory">{previewTitle}</p>
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

      <CloudinaryUploadField
        label="Share preview image"
        value={draft.seo.ogImage ?? ""}
        folder={`wed-pro/${draft.id}/share`}
        cropping
        croppingAspectRatio={1200 / 630}
        helperText="Landscape 1200×630 works best for WhatsApp, Instagram, and iMessage."
        onChange={(value) => {
          update((current) => ({
            ...current,
            seo: {
              ...current.seo,
              ogImage: value,
              whatsappPreviewImage: useSameWhatsAppImage ? value : current.seo.whatsappPreviewImage,
            },
          }));
        }}
      />

      <ToggleRow
        label="Same image for WhatsApp"
        description="When on, one upload is used for all social previews."
        checked={useSameWhatsAppImage}
        onChange={(checked) => {
          setUseSameWhatsAppImage(checked);
          if (checked && draft.seo.ogImage) {
            patchSeo({ whatsappPreviewImage: draft.seo.ogImage });
          }
        }}
      />

      {!useSameWhatsAppImage && (
        <CloudinaryUploadField
          label="WhatsApp-only image (optional)"
          value={draft.seo.whatsappPreviewImage ?? ""}
          folder={`wed-pro/${draft.id}/share/whatsapp`}
          cropping
          croppingAspectRatio={1200 / 630}
          helperText="Override only for WhatsApp if you want a different crop."
          onChange={(value) => patchSeo({ whatsappPreviewImage: value })}
        />
      )}

      <div className="border-t border-champagne-gold/10 pt-5 space-y-4">
        <TextInput
          label="Public link slug"
          value={draft.slug}
          onChange={(value) =>
            update((current) => ({
              ...current,
              slug: slugify(value),
            }))
          }
        />
        {slugTaken && (
          <div className="rounded-xl border border-[#ffb4a8]/25 bg-[#8f0f07]/10 px-3 py-2.5 text-xs leading-relaxed text-[#ffb4a8]">
            This slug is already used by another invitation.
            {suggestedSlug && suggestedSlug !== draft.slug && (
              <>
                {" "}
                Publish will use{" "}
                <button
                  type="button"
                  className="font-mono font-semibold text-champagne-gold underline"
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      slug: suggestedSlug,
                    }))
                  }
                >
                  /w/{suggestedSlug}
                </button>{" "}
                instead.
              </>
            )}
          </div>
        )}
        <p className="text-xs leading-relaxed text-on-surface-variant/60 break-all">{publicUrl}</p>
        {canShare && (
          <Link
            href={sharePath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold"
          >
            Open published invitation
            <ExternalLink size={14} />
          </Link>
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
