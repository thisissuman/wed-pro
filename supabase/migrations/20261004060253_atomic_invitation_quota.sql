-- Task 07: only authenticated creation path; counts drafts AND published rows.
begin;
revoke insert on public.invitations from public, anon, authenticated;
revoke insert (id, user_id, slug, template_id, status, content) on public.invitations from public, anon, authenticated;
drop policy if exists "Owners can create unpublished drafts" on public.invitations;

create function public.create_invitation_draft(
  p_id uuid, p_slug text, p_template_id text, p_content jsonb
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_owner uuid := auth.uid();
  v_row public.invitations;
  v_template text := case when p_template_id = 'garden-mandap'
    then 'royal-3d-cinema' else p_template_id end;
begin
  if v_owner is null then
    raise exception 'Sign in to create an invitation.' using errcode = '42501';
  end if;
  -- All creates by this owner share this transaction lock. The subsequent
  -- READ COMMITTED count sees the previous creator's committed insert.
  perform 1 from public.profiles where id = v_owner for update;
  if not found then
    raise exception 'Owner profile unavailable.' using errcode = '42501';
  end if;
  -- Idempotent retry after an uncertain response cannot consume another slot.
  select * into v_row from public.invitations where id = p_id and user_id = v_owner;
  if found then return to_jsonb(v_row); end if;
  if (select count(*) from public.invitations where user_id = v_owner) >= 3 then
    raise exception 'The beta limit is three total invitations, including published invitations.'
      using errcode = 'P0001', detail = 'invitation_limit_reached';
  end if;
  if p_id is null or p_slug is null or length(p_slug) > 64
     or p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
     or v_template is null or v_template not in ('royal', 'floral-elegance', 'royal-3d-cinema')
     or jsonb_typeof(p_content) is distinct from 'object'
     or jsonb_typeof(p_content -> 'meta') is distinct from 'object' then
    raise exception 'Invalid invitation draft.' using errcode = '22023';
  end if;
  insert into public.invitations (id, user_id, slug, template_id, status, content)
    values (p_id, v_owner, p_slug, v_template, 'draft', p_content)
    returning * into v_row;
  update public.invitations set content = public.invitation_document(p_content, v_row)
    where id = v_row.id returning * into v_row;
  return to_jsonb(v_row);
end;
$$;
revoke all on function public.create_invitation_draft(uuid, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.create_invitation_draft(uuid, text, text, jsonb) to authenticated;
commit;
