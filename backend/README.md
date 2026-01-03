# Vernify Backend (FastAPI)

This backend provides endpoints to upload CSV/XLSX files, run schema-agnostic ML verifications (using existing `ml/` code), store files in Supabase Storage, and persist results in Supabase Postgres with RLS policies.

## Environment variables

- SUPABASE_URL
- SUPABASE_KEY
- SUPABASE_STORAGE_BUCKET (optional, default `uploads`)

## DB migrations

Run the SQL in `backend/db/migrations/001_create_tables.sql` against your Supabase Postgres database (via `supabase` CLI or psql).

Example (supabase CLI):

```bash
# login, set project, then run SQL
supabase sql "$(cat backend/db/migrations/001_create_tables.sql)"
```

If you prefer psql:

```bash
psql "postgres://<user>:<password>@<host>:<port>/<db>" -f backend/db/migrations/001_create_tables.sql
```


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

