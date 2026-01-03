# Integrating Frontend with Vernify Backend

This document shows example calls the React frontend can use to integrate file uploads and verification.

All requests require an Authorization header with the Supabase JWT: `Authorization: Bearer <ACCESS_TOKEN>`

1) Upload file

POST /api/upload
Form-data: file (the CSV or XLSX file)
Returns: upload record with `id` field

Example (fetch):
```
const form = new FormData();
form.append('file', fileInput.files[0]);
const res = await fetch(`${BACKEND_URL}/api/upload`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: form
});
const data = await res.json();
```

2) Start verification

POST /api/verify/{upload_id}
Returns: { verification_id }

3) Get result

GET /api/results/{verification_id}
Returns: verification record with `score`, `scaled_score` (0-100), `report` and `details`.

4) History

GET /api/history
Returns: list of verifications for current user

