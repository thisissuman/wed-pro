import type { Metadata } from "next";
import { getInvitationTitle } from "@/lib/invitations";
import { getOgShareImageUrl } from "@/lib/media-url";
import { getSiteUrl, toAbsoluteUrl } from "@/lib/site-url";
import type { WeddingData } from "@/types/wedding.types";

export function buildInvitationShareMetadata(invitation: WeddingData): Metadata {
  const siteUrl = getSiteUrl();
  const title =
    invitation.seo.pageTitle?.trim() ||
    `${getInvitationTitle(invitation)} - Wedding Invitation`;
  const description =
    invitation.seo.metaDescription?.trim() ||
    `You are invited to celebrate ${getInvitationTitle(invitation)}.`;
  const shareImageRaw =
    invitation.seo.ogImage?.trim() ||
    invitation.seo.whatsappPreviewImage?.trim() ||
    invitation.hero.backgroundMedia?.trim();
  const shareImage = shareImageRaw ? getOgShareImageUrl(shareImageRaw) : "";
  const imageUrl = shareImage?.startsWith("http")
    ? shareImage
    : toAbsoluteUrl(shareImage, siteUrl);

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteUrl}/w/${invitation.slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
