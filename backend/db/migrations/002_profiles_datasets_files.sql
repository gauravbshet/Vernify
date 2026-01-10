-- Create user role enum
create type if not exists public.user_role as enum ('admin', 'validator', 'user');

-- Create profiles table that references auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role public.user_role not null default 'user',
  created_at timestamptz default now()
);

-- Ensure the auth.users row insertion creates a profile with default role 'user'
create or replace function public.handle_auth_user_created()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_auth_user_created();

-- Create datasets table
create table if not exists public.datasets (
  id uuid primary key default gen_random_uuid(),
  dataset_name text not null,
  bias_score double precision,
  bias_status text,
  uploaded_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now()
);

-- Create files table (metadata only)
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  dataset_id uuid not null references public.datasets(id) on delete cascade,
  file_name text not null,
  file_type text not null check (file_type in ('csv', 'excel')),
  file_url text not null,
  uploaded_at timestamptz default now()
);

-- Indexes
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_datasets_uploaded_by on public.datasets(uploaded_by);
create index if not exists idx_files_dataset_id on public.files(dataset_id);

-- Row Level Security policies
-- Profiles: users can SELECT their own profile; admins can SELECT/UPDATE all
alter table public.profiles enable row level security;

create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_admin_full" on public.profiles
  for all using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Datasets: users can access only their own datasets; validators can read all; admins full access
alter table public.datasets enable row level security;

create policy "datasets_select_admin_validator_owner" on public.datasets
  for select using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','validator'))
    OR uploaded_by = auth.uid()
  );

create policy "datasets_insert_owner_or_admin" on public.datasets
  for insert with check (
    uploaded_by = auth.uid() OR
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "datasets_update_owner_or_admin" on public.datasets
  for update using (
    uploaded_by = auth.uid() OR
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    uploaded_by = auth.uid() OR
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "datasets_delete_owner_or_admin" on public.datasets
  for delete using (
    uploaded_by = auth.uid() OR
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Files: access based on the dataset's ownership; validators can read all; admins full access
alter table public.files enable row level security;

create policy "files_select_admin_validator_owner" on public.files
  for select using (
    exists(select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','validator'))
    OR exists(select 1 from public.datasets d where d.id = public.files.dataset_id and d.uploaded_by = auth.uid())
  );

create policy "files_insert_owner_or_admin" on public.files
  for insert with check (
    exists(select 1 from public.datasets d where d.id = public.files.dataset_id and d.uploaded_by = auth.uid())
    OR exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "files_update_owner_or_admin" on public.files
  for update using (
    exists(select 1 from public.datasets d where d.id = public.files.dataset_id and d.uploaded_by = auth.uid())
    OR exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  ) with check (
    exists(select 1 from public.datasets d where d.id = public.files.dataset_id and d.uploaded_by = auth.uid())
    OR exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "files_delete_owner_or_admin" on public.files
  for delete using (
    exists(select 1 from public.datasets d where d.id = public.files.dataset_id and d.uploaded_by = auth.uid())
    OR exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Guidance: to seed an initial admin, run something like:
-- insert into public.profiles (id, email, role) values ('<uuid-of-admin>', 'admin@example.com', 'admin');
-- Note: the `auth.uid()` used in policies expects the JWT-authenticated user's uid (the auth.users.id UUID).
