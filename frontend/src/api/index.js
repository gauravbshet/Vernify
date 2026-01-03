// Simple API helpers for the Vernify backend
// Usage: pass a Supabase access token as `token` when available

const BASE_URL = import.meta.env.VITE_API_URL || '';

function _authHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadFile(file, token) {
    const form = new FormData();
    form.append('file', file);

    const res = await fetch(`${BASE_URL}/api/upload`, {
        method: 'POST',
        headers: _authHeader(token),
        body: form,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
    }
    return res.json();
}

export async function verifyUpload(uploadId, token) {
    const res = await fetch(`${BASE_URL}/api/verify/${uploadId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ..._authHeader(token),
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Verify request failed: ${res.status} ${text}`);
    }
    return res.json();
}

export async function getResult(verificationId, token) {
    const res = await fetch(`${BASE_URL}/api/results/${verificationId}`, {
        method: 'GET',
        headers: _authHeader(token),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Get result failed: ${res.status} ${text}`);
    }
    return res.json();
}

export async function getHistory(token) {
    const res = await fetch(`${BASE_URL}/api/history`, {
        method: 'GET',
        headers: _authHeader(token),
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Get history failed: ${res.status} ${text}`);
    }
    return res.json();
}

export async function healthMl(token) {
    const res = await fetch(`${BASE_URL}/internal/health-ml`, {
        method: 'GET',
        headers: _authHeader(token),
    });
    return res.json();
}
