-- Create uploads table
create table if not exists public.uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  file_name text not null,
  storage_path text not null,
  bucket text not null,
  size bigint,
  mime text,
  status text default 'uploaded',
  created_at timestamptz default now()
);

-- Create verifications table
create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  upload_id uuid references public.uploads(id) on delete cascade,
  user_id uuid not null,
  score double precision,
  scaled_score integer,
  status text default 'queued',
  report jsonb,
  details jsonb,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS and policies so users can only see/modify their own rows.
-- Make sure Supabase Auth is configured and 'auth.uid()' returns a uuid compatible with user_id column.

alter table public.uploads enable row level security;
create policy "uploads_is_owner" on public.uploads
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.verifications enable row level security;
create policy "verifications_is_owner" on public.verifications
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_uploads_user_id on public.uploads(user_id);
create index if not exists idx_verifications_user_id on public.verifications(user_id);
