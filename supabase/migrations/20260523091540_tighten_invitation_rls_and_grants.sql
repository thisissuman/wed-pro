drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Public can view published invitations" on public.invitations;
drop policy if exists "Owners can view own invitations" on public.invitations;
drop policy if exists "Owners can insert own invitations" on public.invitations;
drop policy if exists "Owners can update own invitations" on public.invitations;
drop policy if exists "Owners can delete own invitations" on public.invitations;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Anon can view published invitations"
  on public.invitations for select
  to anon
  using (status = 'published');

create policy "Authenticated can view accessible invitations"
  on public.invitations for select
  to authenticated
  using (((select auth.uid()) = user_id) or status = 'published');

create policy "Owners can insert own invitations"
  on public.invitations for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owners can update own invitations"
  on public.invitations for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Owners can delete own invitations"
  on public.invitations for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.invitations from anon, authenticated;

grant select, update on table public.profiles to authenticated;
grant select on table public.invitations to anon;
grant select, insert, update, delete on table public.invitations to authenticated;
