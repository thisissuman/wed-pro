import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Sparkles, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { InvitationList } from '@/features/invitations/InvitationList';
import type { InvitationRow } from '@/lib/invitations';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const displayEmail = user.email || 'Guest';
  const displayName = user.user_metadata?.full_name || displayEmail.split('@')[0];
  const { data: invitations = [] } = await supabase
    .from('invitations')
    .select('id,user_id,slug,template_id,status,content,created_at,updated_at,published_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <DashboardShell>
      <main className="max-w-[980px] mx-auto px-[var(--spacing-container-margin)] pt-8 md:pt-14 pb-32 min-h-screen">
        <section className="mb-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-champagne-gold/15 bg-champagne-gold/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-champagne-gold">
              <Sparkles size={13} />
              Creator Workspace
            </span>
            <div>
              <h1 className="font-heading text-3xl font-medium tracking-wide text-ivory md:text-4xl">
                Welcome, <span className="text-champagne-gold">{displayName}</span>
              </h1>
              <p className="mt-2 max-w-xl font-body text-sm leading-relaxed text-on-surface-variant/75">
                Create drafts, refine the details, publish, and share a polished wedding invitation link.
              </p>
            </div>
          </div>

          <Link
            href="/template"
            className="inline-flex items-center justify-center gap-2 rounded-full gold-gradient px-6 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-black transition hover:shadow-[0_0_20px_rgba(242,202,80,0.25)] active:scale-95"
          >
            <Plus size={15} />
            New Invitation
            <ArrowRight size={14} />
          </Link>
        </section>

        <InvitationList initialInvitations={(invitations ?? []) as InvitationRow[]} />
      </main>
    </DashboardShell>
  );
}
