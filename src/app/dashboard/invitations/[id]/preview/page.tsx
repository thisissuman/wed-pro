import Link from "next/link";
import { ArrowLeft, Edit3 } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { TemplateRenderer } from "@/templates/TemplateRenderer";
import { normalizeInvitationRow, type InvitationRow } from "@/lib/invitations";
import { createClient } from "@/utils/supabase/server";

interface InvitationPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvitationPreviewPage({ params }: InvitationPreviewPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("invitations")
    .select("id,user_id,slug,template_id,status,content,created_at,updated_at,published_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const invitation = normalizeInvitationRow(data as InvitationRow);

  return (
    <main className="-mt-16 min-h-screen bg-background md:-mt-[72px]">
      <div className="fixed left-4 right-4 top-4 z-50 flex items-center justify-between gap-3 md:left-6 md:right-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-champagne-gold/20 bg-charcoal-black/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold backdrop-blur-xl"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>
        <Link
          href={`/dashboard/invitations/${invitation.id}/edit`}
          className="inline-flex items-center gap-2 rounded-full gold-gradient px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-deep-maroon"
        >
          <Edit3 size={14} />
          Edit
        </Link>
      </div>
      <TemplateRenderer templateId={invitation.templateId} data={invitation} isPreview />
    </main>
  );
}
