-- RSVPs table: captures guest responses for published invitations.
-- Schema follows the JSONB-light document store strategy — only the small
-- structured fields that we actually want to query (counts, attendance) are
-- in real columns. Anything richer can be added later.

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  attendance text not null check (attendance in ('yes', 'no', 'maybe')),
  guests_count int not null default 1 check (guests_count >= 0 and guests_count <= 20),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_rsvps_invitation_id on public.rsvps (invitation_id);
create index if not exists idx_rsvps_created_at on public.rsvps (created_at desc);

alter table public.rsvps enable row level security;

drop policy if exists "Anyone can submit RSVP for published invitations" on public.rsvps;
drop policy if exists "Authenticated can submit RSVP for published invitations" on public.rsvps;
drop policy if exists "Owners can view RSVPs for their invitations" on public.rsvps;
drop policy if exists "Owners can delete RSVPs for their invitations" on public.rsvps;

-- Guests submitting from /w/[slug] are anonymous; allow inserts only when the
-- parent invitation is published.
create policy "Anyone can submit RSVP for published invitations"
  on public.rsvps for insert
  to anon
  with check (
    exists (
      select 1
      from public.invitations
      where invitations.id = rsvps.invitation_id
        and invitations.status = 'published'
    )
  );

create policy "Authenticated can submit RSVP for published invitations"
  on public.rsvps for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.invitations
      where invitations.id = rsvps.invitation_id
        and invitations.status = 'published'
    )
  );

-- Only the invitation owner can read the guest list.
create policy "Owners can view RSVPs for their invitations"
  on public.rsvps for select
  to authenticated
  using (
    exists (
      select 1
      from public.invitations
      where invitations.id = rsvps.invitation_id
        and invitations.user_id = (select auth.uid())
    )
  );

-- Owners can also remove submissions (e.g. spam).
create policy "Owners can delete RSVPs for their invitations"
  on public.rsvps for delete
  to authenticated
  using (
    exists (
      select 1
      from public.invitations
      where invitations.id = rsvps.invitation_id
        and invitations.user_id = (select auth.uid())
    )
  );

revoke all on table public.rsvps from anon, authenticated;
grant insert on table public.rsvps to anon;
grant insert, select, delete on table public.rsvps to authenticated;
