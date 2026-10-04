-- Pending application in roadmap task 16. Deploy this migration and its client
-- together: legacy clients that UPDATE invitations directly are incompatible.
begin;

alter table public.invitations
  add column draft_revision bigint not null default 0 check (draft_revision >= 0),
  add column first_published_at timestamptz;

-- Keep links for both currently published and identifiable previously published
-- invitations. Do not cast historical JSON timestamps: malformed legacy text
-- must not stop a safe backfill. created_at is a conservative history marker.
update public.invitations
set first_published_at = coalesce(published_at, created_at)
where status = 'published'
   or published_at is not null
   or nullif(content #>> '{meta,publishedAt}', '') is not null;

create table public.published_invitations (
  id uuid primary key references public.invitations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null unique,
  template_id text not null,
  status text not null default 'published' check (status = 'published'),
  content jsonb not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  published_at timestamptz not null
);

-- Preserve exactly the last public JSONB document; never substitute starter
-- content or discard historical content. Working JSON stays in invitations.
insert into public.published_invitations
  (id, user_id, slug, template_id, status, content, created_at, updated_at, published_at)
select id, user_id, slug, template_id, 'published', content, created_at,
       updated_at, coalesce(published_at, updated_at)
from public.invitations where status = 'published';

alter table public.published_invitations enable row level security;
create policy "Guests can read published snapshots"
  on public.published_invitations for select to anon, authenticated using (true);
revoke all on public.published_invitations from public, anon, authenticated;
grant select on public.published_invitations to anon, authenticated;

-- Public SELECT on working rows is deliberately removed, including for logged
-- in non-owners. RLS protects SELECT * and direct REST reads, not just the UI.
alter table public.invitations enable row level security;
-- Reset invitation policies, including old manually named public/FOR ALL
-- policies: a leftover permissive policy must not expose working content.
do $$
declare v_policy record;
begin
  for v_policy in select policyname from pg_policies
    where schemaname = 'public' and tablename = 'invitations'
  loop
    execute format('drop policy %I on public.invitations', v_policy.policyname);
  end loop;
end;
$$;
create policy "Owners can view working invitations"
  on public.invitations for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Owners can create unpublished drafts"
  on public.invitations for insert to authenticated
  with check ((select auth.uid()) = user_id and status = 'draft'
              and published_at is null and first_published_at is null
              and draft_revision = 0);
create policy "Owners can delete working invitations"
  on public.invitations for delete to authenticated
  using ((select auth.uid()) = user_id);
-- FK cascade removes the published copy when an owner deletes an invitation.
-- Column grants prevent clients forging revision/publication history at INSERT.
revoke all on public.invitations from public, anon, authenticated;
grant select, delete on public.invitations to authenticated;
grant insert (id, user_id, slug, template_id, status, content) on public.invitations to authenticated;

-- Internal pure helper: authoritative row metadata overrides client JSON.
create function public.invitation_document(p_content jsonb, p_row public.invitations)
returns jsonb language sql stable set search_path = '' as $$
  select p_content || jsonb_build_object(
    'id', p_row.id, 'slug', p_row.slug, 'templateId', p_row.template_id,
    'status', p_row.status,
    'meta', ((case when jsonb_typeof(p_content -> 'meta') = 'object'
              then p_content -> 'meta' else '{}'::jsonb end)
             - 'publishedAt' - 'firstPublishedAt' - 'draftRevision')
      || jsonb_build_object('userId', p_row.user_id, 'createdAt', p_row.created_at,
                            'updatedAt', p_row.updated_at, 'draftRevision', p_row.draft_revision)
      || case when p_row.published_at is null then '{}'::jsonb
              else jsonb_build_object('publishedAt', p_row.published_at) end
      || case when p_row.first_published_at is null then '{}'::jsonb
              else jsonb_build_object('firstPublishedAt', p_row.first_published_at) end
  );
$$;
revoke all on function public.invitation_document(jsonb, public.invitations) from public, anon, authenticated;

create function public.save_invitation_draft(
  p_id uuid, p_content jsonb, p_template_id text, p_expected_revision bigint
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_row public.invitations;
begin
  select * into v_row from public.invitations
    where id = p_id and user_id = auth.uid() for update;
  if not found then raise exception 'Invitation unavailable.' using errcode = '42501'; end if;
  if p_expected_revision is distinct from v_row.draft_revision then
    raise exception 'This invitation changed in another session. Reload before saving.' using errcode = '40001';
  end if;
  if jsonb_typeof(p_content) is distinct from 'object'
     or jsonb_typeof(p_content -> 'meta') is distinct from 'object'
     or nullif(btrim(p_template_id), '') is null then
    raise exception 'Invalid draft document.' using errcode = '22023';
  end if;
  v_row.template_id := p_template_id;
  v_row.draft_revision := v_row.draft_revision + 1;
  v_row.updated_at := now();
  -- Slug/status/publication history cannot be changed by autosave.
  update public.invitations set template_id = v_row.template_id,
    draft_revision = v_row.draft_revision,
    content = public.invitation_document(p_content, v_row)
    where id = v_row.id returning * into v_row;
  return to_jsonb(v_row);
end;
$$;

create function public.publish_invitation_snapshot(
  p_id uuid, p_expected_revision bigint, p_requested_slug text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_row public.invitations;
  v_base text;
  v_slug text;
  v_suffix text;
  v_attempt integer;
  v_allocated boolean := false;
begin
  select * into v_row from public.invitations
    where id = p_id and user_id = auth.uid() for update;
  if not found then raise exception 'Invitation unavailable.' using errcode = '42501'; end if;
  if p_expected_revision is distinct from v_row.draft_revision then
    raise exception 'This invitation changed in another session. Reload before publishing.' using errcode = '40001';
  end if;
  if v_row.first_published_at is null then
    v_base := btrim(p_requested_slug);
    if v_base is null or length(v_base) > 64
       or v_base !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
      raise exception 'Add couple names before publishing.' using errcode = '22023';
    end if;
  else
    -- Never rename a previously shared link, even after unpublishing.
    v_base := v_row.slug;
  end if;

  -- The unique constraint, not an RLS-filtered availability query, arbitrates
  -- concurrent allocations and collisions with private drafts of other owners.
  for v_attempt in 0..24 loop
    if v_attempt = 0 then v_slug := v_base;
    else
      v_suffix := '-' || (v_attempt + 1)::text;
      v_slug := rtrim(left(v_base, 64 - length(v_suffix)), '-') || v_suffix;
    end if;
    begin
      update public.invitations set slug = v_slug, status = 'published',
        first_published_at = coalesce(first_published_at, now()),
        published_at = now(), draft_revision = draft_revision + 1
        where id = v_row.id returning * into v_row;
      v_allocated := true;
      exit;
    exception when unique_violation then
      if v_row.first_published_at is not null then raise; end if;
    end;
  end loop;
  if not v_allocated then
    raise exception 'Could not allocate a wedding link. Try different couple names.' using errcode = '23505';
  end if;
  update public.invitations set content = public.invitation_document(v_row.content, v_row)
    where id = v_row.id returning * into v_row;
  insert into public.published_invitations
    (id, user_id, slug, template_id, status, content, created_at, updated_at, published_at)
  values (v_row.id, v_row.user_id, v_row.slug, v_row.template_id, 'published',
          v_row.content, v_row.created_at, v_row.updated_at, v_row.published_at)
  on conflict (id) do update set slug = excluded.slug,
    template_id = excluded.template_id, content = excluded.content,
    updated_at = excluded.updated_at, published_at = excluded.published_at;
  return to_jsonb(v_row);
end;
$$;

create function public.unpublish_invitation_snapshot(p_id uuid, p_expected_revision bigint)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_row public.invitations;
begin
  select * into v_row from public.invitations
    where id = p_id and user_id = auth.uid() for update;
  if not found then raise exception 'Invitation unavailable.' using errcode = '42501'; end if;
  if p_expected_revision is distinct from v_row.draft_revision then
    raise exception 'This invitation changed in another session. Reload before unpublishing.' using errcode = '40001';
  end if;
  delete from public.published_invitations where id = v_row.id;
  update public.invitations set status = 'draft', published_at = null,
    draft_revision = draft_revision + 1 where id = v_row.id returning * into v_row;
  update public.invitations set content = public.invitation_document(v_row.content, v_row)
    where id = v_row.id returning * into v_row;
  return to_jsonb(v_row);
end;
$$;

revoke all on function public.save_invitation_draft(uuid, jsonb, text, bigint) from public, anon, authenticated;
revoke all on function public.publish_invitation_snapshot(uuid, bigint, text) from public, anon, authenticated;
revoke all on function public.unpublish_invitation_snapshot(uuid, bigint) from public, anon, authenticated;
grant execute on function public.save_invitation_draft(uuid, jsonb, text, bigint) to authenticated;
grant execute on function public.publish_invitation_snapshot(uuid, bigint, text) to authenticated;
grant execute on function public.unpublish_invitation_snapshot(uuid, bigint) to authenticated;

commit;
