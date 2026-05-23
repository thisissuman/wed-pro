create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  slug text not null unique,
  template_id text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists idx_invitations_user_id on public.invitations (user_id);

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_invitations_updated_at on public.invitations;
create trigger update_invitations_updated_at
  before update on public.invitations
  for each row execute function public.update_updated_at_column();

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;

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
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "Public can view published invitations"
  on public.invitations for select
  to public
  using (status = 'published');

create policy "Owners can view own invitations"
  on public.invitations for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Owners can insert own invitations"
  on public.invitations for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Owners can update own invitations"
  on public.invitations for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Owners can delete own invitations"
  on public.invitations for delete
  to authenticated
  using (auth.uid() = user_id);
