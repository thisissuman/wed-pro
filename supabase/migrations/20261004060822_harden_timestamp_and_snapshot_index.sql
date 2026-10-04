-- Task 16: live advisor findings. Preserve existing data and access semantics.
begin;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create index if not exists idx_published_invitations_user_id
  on public.published_invitations(user_id);

alter policy "Users can view own profile" on public.profiles
  using ((select auth.uid()) = id);
alter policy "Users can update own profile" on public.profiles
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

commit;
