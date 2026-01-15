# Vernify Backend (FastAPI)

This backend provides endpoints to upload CSV/XLSX files, run schema-agnostic ML verifications (using existing `ml/` code), store files in Supabase Storage, and persist results in Supabase Postgres with RLS policies.

## Environment variables

- SUPABASE_URL
- SUPABASE_KEY (anon/public key for auth)
- SUPABASE_SERVICE_ROLE_KEY (service role key for bypassing RLS - required for role checking)
- SUPABASE_STORAGE_BUCKET (optional, default `uploads`)

## DB migrations

Run the SQL migrations in `backend/db/migrations/` against your Supabase Postgres database (via `supabase` CLI or `psql`). A new migration (`002_profiles_datasets_files.sql`) creates `profiles`, `datasets`, `files`, a `user_role` enum, an auth trigger that auto-creates a `profiles` row when `auth.users` is created, and Row Level Security (RLS) policies that implement Admin/Validator/User access control.

Example (supabase CLI):

```bash
# login, set project, then run SQL (order matters: run 001 then 002)
supabase sql "$(cat backend/db/migrations/001_create_tables.sql)"
supabase sql "$(cat backend/db/migrations/002_profiles_datasets_files.sql)"
```

If you prefer psql:

```bash
psql "postgres://<user>:<password>@<host>:<port>/<db>" -f backend/db/migrations/001_create_tables.sql
psql "postgres://<user>:<password>@<host>:<port>/<db>" -f backend/db/migrations/002_profiles_datasets_files.sql
```

To create an initial admin user (example), first sign up the user via Supabase Auth (or insert a user in `auth.users`), then run:

```sql
-- replace <uuid> and <email> with your admin's values
insert into public.profiles (id, email, role) values ('<uuid>', '<email>', 'admin');
```

This will allow that user to manage roles and view all datasets/files via the Admin RLS policy.


## API endpoints (summary)

- POST /api/upload
  - Auth: Bearer token (Supabase JWT)
  - Form-data: file (CSV or XLSX)
  - Returns: upload record

- POST /api/verify/{upload_id}
  - Starts verification in background; returns verification id

- GET /api/results/{verification_id}
  - Returns verification result and explainable report

- GET /api/history
  - Lists user's verifications

## Deployment

Build Docker image and run:

docker build -t vernify-backend:latest ./backend

docker run -e SUPABASE_URL=... -e SUPABASE_KEY=... -p 8000:8000 vernify-backend:latest

