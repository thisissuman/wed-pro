import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { GuestList } from "@/features/rsvp/GuestList";
import {
  getInvitationTitle,
  normalizeInvitationRow,
  type InvitationRow,
} from "@/lib/invitations";
import type { RsvpRow } from "@/lib/rsvp/types";
import { buildLoginUrl } from "@/lib/auth/redirects";
import { createClient } from "@/utils/supabase/server";

interface GuestsPageProps {
  params: Promise<{ id: string }>;
}

export default async function GuestsPage({ params }: GuestsPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildLoginUrl(`/dashboard/invitations/${id}/guests`));
  }

  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id,user_id,slug,template_id,status,content,created_at,updated_at,published_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (invitationError || !invitation) {
    notFound();
  }

  const normalized = normalizeInvitationRow(invitation as InvitationRow);

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("id,invitation_id,name,attendance,guests_count,message,created_at")
    .eq("invitation_id", invitation.id)
    .order("created_at", { ascending: false });

  const guests = (rsvps ?? []) as RsvpRow[];

  return (
    <DashboardShell>
      <main className="mx-auto max-w-[1080px] px-[var(--spacing-container-margin)] pb-24 pt-8 md:pt-12">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold/80 transition hover:text-champagne-gold"
        >
          <ArrowLeft size={14} />
          Dashboard
        </Link>

        <header className="mt-4 mb-8 flex flex-col gap-3 border-b border-champagne-gold/10 pb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold/70">
            Guest Responses
          </p>
          <h1 className="font-heading text-3xl text-ivory md:text-4xl">
            {getInvitationTitle(normalized)}
          </h1>
          <p className="font-body text-sm text-on-surface-variant/70">
            Responses submitted through the public invitation page.
          </p>
        </header>

        <GuestList guests={guests} />
      </main>
    </DashboardShell>
  );
}
