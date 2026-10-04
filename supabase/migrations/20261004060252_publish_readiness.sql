-- Pending task 16. Requires 20261004000000_private_drafts_and_published_snapshots.
begin;

create function public.invitation_real_text(p_value text) returns boolean
language sql immutable set search_path = '' as $$
  select coalesce(btrim(p_value), '') <> '' and lower(btrim(p_value)) not in
    ('bride', 'groom', 'bride name', 'groom name', 'your name', 'venue', 'venue name', 'venue address', 'address', 'event title');
$$;
create function public.invitation_calendar_date(p_value text) returns boolean
language plpgsql immutable set search_path = '' as $$
begin
  if p_value is null or btrim(p_value) !~ '^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2}))?$' then return false; end if;
  perform left(btrim(p_value), 10)::date;
  if length(btrim(p_value)) > 10 then perform btrim(p_value)::timestamptz; end if;
  return true;
exception when others then return false;
end;
$$;
create function public.invitation_safe_url(p_value text, p_local boolean) returns boolean
language sql immutable set search_path = '' as $$
  select coalesce(btrim(p_value), '') = '' or (
    btrim(p_value) !~ '[[:space:][:cntrl:]\\]' and (
      (p_local and btrim(p_value) ~ '^/[^/]' and btrim(p_value) !~* '^/%(2f|5c)') or
      btrim(p_value) ~* '^https?://[^/?#@[:space:]\\]+([/?#].*)?$'
    )
  );
$$;

create function public.invitation_publish_issues(p_content jsonb) returns jsonb
language plpgsql stable set search_path = '' as $$
declare
  v_issues jsonb := '[]'::jsonb;
  v_side text;
  v_date text;
  v_event jsonb;
  v_index integer;
  v_path text;
  v_has_location boolean := false;
  v_demo boolean := false;
  v_url record;
  v_step text;
  v_rsvp_type text;
begin
  foreach v_side in array array['bride', 'groom'] loop
    if not public.invitation_real_text(p_content #>> array['couple', v_side, 'name']) then
      v_issues := v_issues || jsonb_build_array(jsonb_build_object('path', 'couple.' || v_side || '.name', 'step', 'wedding-details', 'message', 'Enter the ' || v_side || '''s real name.'));
    end if;
  end loop;
  v_date := coalesce(nullif(btrim(p_content #>> '{couple,weddingDate}'), ''), nullif(btrim(p_content #>> '{events,0,date}'), ''), left(p_content #>> '{countdown,targetDate}', 10));
  if not public.invitation_calendar_date(v_date) then
    v_issues := v_issues || '[{"path":"couple.weddingDate","step":"wedding-details","message":"Enter a real calendar date for the wedding."}]'::jsonb;
  end if;
  if jsonb_typeof(p_content -> 'events') is distinct from 'array' or p_content -> 'events' = '[]'::jsonb then
    v_issues := v_issues || '[{"path":"events","step":"events","message":"Add at least one celebration with its date, time, and venue."}]'::jsonb;
  else
    for v_event, v_index in select value, (ordinality - 1)::integer from jsonb_array_elements(p_content -> 'events') with ordinality loop
      v_path := 'events.' || v_index::text;
      if not public.invitation_real_text(v_event ->> 'title') then
        v_issues := v_issues || jsonb_build_array(jsonb_build_object('path', v_path || '.title', 'step', 'events', 'message', 'Add a title for this event.'));
      end if;
      if not public.invitation_calendar_date(v_event ->> 'date') then
        v_issues := v_issues || jsonb_build_array(jsonb_build_object('path', v_path || '.date', 'step', 'events', 'message', 'Enter a real calendar date for this event.'));
      end if;
      if coalesce(btrim(v_event ->> 'time'), '') !~* '^(([01]?\d|2[0-3]):[0-5]\d|(0?[1-9]|1[0-2]):[0-5]\d\s*[AP]M)$' then
        v_issues := v_issues || jsonb_build_array(jsonb_build_object('path', v_path || '.time', 'step', 'events', 'message', 'Use a time such as 19:00 or 7:00 PM.'));
      end if;
      if not public.invitation_real_text(v_event ->> 'venue') then
        v_issues := v_issues || jsonb_build_array(jsonb_build_object('path', v_path || '.venue', 'step', 'events', 'message', 'Add this event''s venue name.'));
      end if;
    end loop;
  end if;
  if not public.invitation_real_text(p_content #>> '{venue,name}') then
    v_issues := v_issues || '[{"path":"venue.name","step":"venue","message":"Replace the sample venue name with your venue."}]'::jsonb;
  end if;
  v_has_location := public.invitation_real_text(p_content #>> '{venue,address}') or
    (coalesce(btrim(p_content #>> '{venue,googleMapLink}'), '') <> '' and public.invitation_safe_url(p_content #>> '{venue,googleMapLink}', false));
  if jsonb_typeof(p_content #> '{venue,coordinates,lat}') = 'number' and jsonb_typeof(p_content #> '{venue,coordinates,lng}') = 'number' then
    v_has_location := v_has_location or (abs((p_content #>> '{venue,coordinates,lat}')::numeric) <= 90 and abs((p_content #>> '{venue,coordinates,lng}')::numeric) <= 180);
  end if;
  if not coalesce(v_has_location, false) then
    v_issues := v_issues || '[{"path":"venue.address","step":"venue","message":"Add the venue address, a valid map link, or coordinates."}]'::jsonb;
  end if;
  v_rsvp_type := p_content #>> '{rsvp,type}';
  -- Preserve the former form mode deliberately, matching normalizeRsvpData.
  if v_rsvp_type = 'form' then
    v_rsvp_type := case when coalesce(btrim(p_content #>> '{rsvp,formUrl}'), '') <> '' then 'link' else 'whatsapp' end;
  end if;
  if (p_content #> '{sections,showRSVP}') is distinct from 'false'::jsonb then
    if v_rsvp_type = 'whatsapp' then
      if regexp_replace(coalesce(p_content #>> '{rsvp,whatsappNumber}', ''), '[\s-]', '', 'g') !~ '^\+?[0-9]{10,15}$' then
        v_issues := v_issues || '[{"path":"rsvp.whatsappNumber","step":"rsvp","message":"Add a WhatsApp number with country code (10–15 digits)."}]'::jsonb;
      end if;
    elsif v_rsvp_type is distinct from 'link' or coalesce(btrim(p_content #>> '{rsvp,formUrl}'), '') = '' or not public.invitation_safe_url(p_content #>> '{rsvp,formUrl}', false) then
      v_issues := v_issues || '[{"path":"rsvp.formUrl","step":"rsvp","message":"Add a valid HTTP or HTTPS RSVP link."}]'::jsonb;
    end if;
  end if;

  -- Inspect every consumed URL-bearing key, including hidden optional sections.
  for v_url in
    with recursive document(path, value) as (
      select array[]::text[], p_content
      union all
      select document.path || child.key, child.value from document
      cross join lateral (
        select key, value from jsonb_each(case when jsonb_typeof(document.value) = 'object' then document.value else '{}'::jsonb end)
        union all
        select (ordinality - 1)::text, value from jsonb_array_elements(case when jsonb_typeof(document.value) = 'array' then document.value else '[]'::jsonb end) with ordinality
      ) child
    ) select path, value from document where path[1] in ('couple', 'hero', 'music', 'venue', 'rsvp', 'seo', 'events', 'gallery', 'story') and path[array_length(path, 1)] in
      ('photo', 'url', 'backgroundMedia', 'backgroundImage', 'ogImage', 'whatsappPreviewImage', 'googleMapLink', 'formUrl')
  loop
    if v_url.value <> 'null'::jsonb and (jsonb_typeof(v_url.value) <> 'string' or not public.invitation_safe_url(v_url.value #>> '{}', v_url.path[array_length(v_url.path, 1)] not in ('googleMapLink', 'formUrl'))) then
      v_step := case v_url.path[1] when 'couple' then 'wedding-details' when 'hero' then 'media' when 'music' then 'media' when 'seo' then 'share-preview' else v_url.path[1] end;
      v_issues := v_issues || jsonb_build_array(jsonb_build_object('path', array_to_string(v_url.path, '.'), 'step', v_step, 'message', 'Use a hosted HTTP/HTTPS URL; inline data and other protocols are unsupported.'));
    end if;
  end loop;
  if (p_content #> '{sections,showStory}') is distinct from 'false'::jsonb then
    select exists(select 1 from jsonb_array_elements(case when jsonb_typeof(p_content #> '{story,timeline}') = 'array' then p_content #> '{story,timeline}' else '[]'::jsonb end) e
      where btrim(e ->> 'description') in (
        'A chance encounter at a friend''s Holi celebration. One conversation that turned into hours.',
        'A quiet café, two nervous hearts, and a conversation that felt like it could last forever.',
        'Under a thousand fairy lights at her favourite rooftop, he asked the question that changed everything.'
      )) into v_demo;
  end if;
  select v_demo or exists(select 1 from jsonb_array_elements(case when jsonb_typeof(p_content #> '{gallery,images}') = 'array' then p_content #> '{gallery,images}' else '[]'::jsonb end) e
    where e ->> 'url' ~ 'images\.unsplash\.com/(photo-1583089892943-e02e5b017b6a|photo-1519741497674-611481863552|photo-1511285560929-80b456fea0bc|photo-1606216794074-735e91aa2c92|photo-1465495976277-4387d4b0b4c6|photo-1522673607200-164d1b6ce486)') into v_demo;
  if v_demo and (p_content -> 'demoContentAcknowledged') is distinct from 'true'::jsonb then
    v_issues := v_issues || '[{"path":"demoContentAcknowledged","step":"gallery","message":"Review the sample story/stock photos. Replace them, hide/remove them, or acknowledge their use."}]'::jsonb;
  end if;
  return v_issues;
end;
$$;

revoke all on function public.invitation_real_text(text) from public, anon, authenticated;
revoke all on function public.invitation_calendar_date(text) from public, anon, authenticated;
revoke all on function public.invitation_safe_url(text, boolean) from public, anon, authenticated;
revoke all on function public.invitation_publish_issues(jsonb) from public, anon, authenticated;

create or replace function public.publish_invitation_snapshot(
  p_id uuid, p_expected_revision bigint, p_requested_slug text
) returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_row public.invitations;
  v_base text;
  v_slug text;
  v_suffix text;
  v_attempt integer;
  v_allocated boolean := false;
  v_issues jsonb;
begin
  select * into v_row from public.invitations
    where id = p_id and user_id = auth.uid() for update;
  if not found then raise exception 'Invitation unavailable.' using errcode = '42501'; end if;
  if p_expected_revision is distinct from v_row.draft_revision then
    raise exception 'This invitation changed in another session. Reload before publishing.' using errcode = '40001';
  end if;
  v_issues := public.invitation_publish_issues(v_row.content);
  if jsonb_array_length(v_issues) > 0 then
    raise exception 'Complete the publish checklist before sharing.' using errcode = '22023', detail = v_issues::text;
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
  if v_row.content #>> '{rsvp,type}' = 'form' then
    v_row.content := jsonb_set(v_row.content, '{rsvp,type}', to_jsonb(case when coalesce(btrim(v_row.content #>> '{rsvp,formUrl}'), '') <> '' then 'link'::text else 'whatsapp'::text end));
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

commit;
