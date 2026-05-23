import { notFound, redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { InvitationEditor } from "@/features/invitations/InvitationEditor";
import { normalizeInvitationRow, type InvitationRow } from "@/lib/invitations";
import { createClient } from "@/utils/supabase/server";

interface EditInvitationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditInvitationPage({ params }: EditInvitationPageProps) {
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

  return (
    <DashboardShell>
      <InvitationEditor initialData={normalizeInvitationRow(data as InvitationRow)} />
    </DashboardShell>
  );
}
