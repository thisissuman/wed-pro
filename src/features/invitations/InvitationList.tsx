"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Copy, Edit3, Eye, Globe2, Loader2, Plus, Send, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  getInvitationDateLabel,
  getInvitationTitle,
  getPublicInvitationPath,
  normalizeInvitationRow,
  type InvitationRow,
} from "@/lib/invitations";
import type { WeddingData } from "@/types/wedding.types";

interface InvitationListProps {
  initialInvitations: InvitationRow[];
}

export function InvitationList({ initialInvitations }: InvitationListProps) {
  const [rows, setRows] = useState(initialInvitations);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const invitations = useMemo(() => rows.map(normalizeInvitationRow), [rows]);

  const updateRow = (id: string, patch: Partial<InvitationRow>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );
  };

  const publishInvitation = async (data: WeddingData) => {
    setBusyId(data.id);
    const supabase = createClient();
    const publishedAt = new Date().toISOString();
    const content: WeddingData = {
      ...data,
      status: "published",
      meta: {
        ...data.meta,
        publishedAt,
        updatedAt: publishedAt,
      },
    };

    const { data: updated, error } = await supabase
      .from("invitations")
      .update({
        status: "published",
        published_at: publishedAt,
        content,
      })
      .eq("id", data.id)
      .select("updated_at,published_at,status,content")
      .single();

    if (!error && updated) {
      updateRow(data.id, {
        status: "published",
        published_at: updated.published_at,
        updated_at: updated.updated_at,
        content: updated.content,
      });
    }

    setBusyId(null);
  };

  const copyShareLink = async (data: WeddingData) => {
    const url = `${window.location.origin}${getPublicInvitationPath(data.slug)}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(data.id);
    window.setTimeout(() => setCopiedId(null), 1600);
  };

  if (invitations.length === 0) {
    return (
      <section className="rounded-2xl border border-champagne-gold/10 bg-surface-container/70 p-7 text-center shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-champagne-gold/20 bg-champagne-gold/10 text-champagne-gold">
          <Plus size={24} />
        </div>
        <h2 className="font-heading text-2xl text-ivory">Create your first invitation</h2>
        <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-on-surface-variant/75">
          Choose the Royal Rajputana template and we will open a draft editor for your wedding details.
        </p>
        <Link
          href="/template"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-full gold-gradient px-6 py-3 font-heading text-xs font-semibold uppercase tracking-[0.14em] text-deep-maroon transition hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95"
        >
          Browse Template
          <Send size={15} />
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {invitations.map((invitation) => {
        const isPublished = invitation.status === "published";
        const isBusy = busyId === invitation.id;
        const title = getInvitationTitle(invitation);

        return (
          <article
            key={invitation.id}
            className="rounded-2xl border border-champagne-gold/10 bg-surface-container/70 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-champagne-gold/15 bg-champagne-gold/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-champagne-gold">
                    {isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="rounded-full border border-ivory/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-on-surface-variant/70">
                    {invitation.templateId}
                  </span>
                </div>
                <h2 className="truncate font-heading text-2xl text-ivory">{title}</h2>
                <p className="mt-1 font-body text-sm text-on-surface-variant/70">
                  {getInvitationDateLabel(invitation)} · /w/{invitation.slug}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
                <Link
                  href={`/dashboard/invitations/${invitation.id}/edit`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold transition hover:bg-champagne-gold/10"
                >
                  <Edit3 size={14} />
                  Edit
                </Link>
                <Link
                  href={`/dashboard/invitations/${invitation.id}/preview`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold transition hover:bg-champagne-gold/10"
                >
                  <Eye size={14} />
                  Preview
                </Link>
                <Link
                  href={`/dashboard/invitations/${invitation.id}/guests`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold transition hover:bg-champagne-gold/10"
                >
                  <Users size={14} />
                  Guests
                </Link>
                {isPublished ? (
                  <button
                    type="button"
                    onClick={() => copyShareLink(invitation)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-champagne-gold/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold transition hover:bg-champagne-gold/10"
                  >
                    {copiedId === invitation.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === invitation.id ? "Copied" : "Copy"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => publishInvitation(invitation)}
                    disabled={isBusy}
                    className="inline-flex items-center justify-center gap-2 rounded-full gold-gradient px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-deep-maroon transition active:scale-95 disabled:pointer-events-none disabled:opacity-60"
                  >
                    {isBusy ? <Loader2 size={14} className="animate-spin" /> : <Globe2 size={14} />}
                    Publish
                  </button>
                )}
                {isPublished && (
                  <Link
                    href={getPublicInvitationPath(invitation.slug)}
                    className="inline-flex items-center justify-center gap-2 rounded-full gold-gradient px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-deep-maroon transition active:scale-95"
                  >
                    <Globe2 size={14} />
                    Open
                  </Link>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
