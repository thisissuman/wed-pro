import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { buildInvitationShareMetadata } from "@/lib/seo";
import {
  normalizeInvitationRow,
  type InvitationRow,
} from "@/lib/invitations";
import { createClient } from "@/utils/supabase/server";

interface PublicInvitationPageProps {
  params: Promise<{ slug: string }>;
}

const getPublishedInvitation = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invitations")
    .select("id,user_id,slug,template_id,status,content,created_at,updated_at,published_at")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    return null;
  }

  return normalizeInvitationRow(data as InvitationRow);
});

export async function generateMetadata({
  params,
}: PublicInvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const invitation = await getPublishedInvitation(slug);

  if (!invitation) {
    return {
      title: "Invitation Not Found | Vivaha Studio",
    };
  }

  return buildInvitationShareMetadata(invitation);
}

export default async function PublicInvitationPage({ params }: PublicInvitationPageProps) {
  const { slug } = await params;
  const invitation = await getPublishedInvitation(slug);

  if (!invitation) {
    notFound();
  }

  return (
    <main className="-mt-16 min-h-screen bg-background md:-mt-[72px]">
      <TemplateRenderer templateId={invitation.templateId} data={invitation} />
    </main>
  );
}
