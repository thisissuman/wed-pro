-- A stale expected revision is an application conflict, not a transient
-- serialization failure. PostgREST 14 retries SQLSTATE 40001 indefinitely.
-- Preserve the applied function bodies/grants, changing only this error code.
begin;
do $$
declare
  v_signature text;
  v_definition text;
begin
  foreach v_signature in array array[
    'public.save_invitation_draft(uuid,jsonb,text,bigint)',
    'public.publish_invitation_snapshot(uuid,bigint,text)',
    'public.unpublish_invitation_snapshot(uuid,bigint)'
  ] loop
    select pg_get_functiondef(v_signature::regprocedure) into v_definition;
    execute replace(v_definition, '''40001''', '''PT409''');
  end loop;
end;
$$;
notify pgrst, 'reload schema';
commit;
