const BASE_URL = import.meta.env.VITE_API_URL || '';

function _authHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function _safeJsonParse(response) {
    const text = await response.text();

    if (!text || text.trim() === '') {
        return {};
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        const contentType = response.headers.get('content-type');
        throw new Error(`Invalid JSON response: ${e.message}. Content-Type: ${contentType || 'none'}. Response: ${text.substring(0, 100)}`);
    }
}

function _extractTokenFromSession(session) {
    if (!session) return null;
    return (
        session.access_token ||
        session.accessToken ||
        session.access_token ||
        (session.token ? session.token.access_token : null)
    );
}

export async function signIn({ email, password, role } = {}) {
    const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
    });

    if (!res.ok) {
        const text = await res.text();
        let errorMessage = `Sign in failed: ${res.status}`;
        try {
            const errorJson = JSON.parse(text);
            errorMessage = errorJson?.message || errorMessage;
        } catch {
            errorMessage = text || errorMessage;
        }
        throw new Error(errorMessage);
    }

    const json = await _safeJsonParse(res);
    if (!json) {
        throw new Error('Empty JSON response');
    }
    if (!json.success) {
        return json;
    }

    const session = json.data?.session;
    const token = _extractTokenFromSession(session);
    if (token) {
        try {
            localStorage.setItem('vernify_token', token);
        } catch (e) {
            console.warn('Failed to store token in localStorage', e);
        }
    }
    return json;
}

export function getToken() {
    try {
        return localStorage.getItem('vernify_token');
    } catch (e) {
        return null;
    }
}

export async function signOut() {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/auth/signout`, {
        method: 'POST',
        headers: {
            ..._authHeader(token),
            'Content-Type': 'application/json',
        },
    });
    try {
        localStorage.removeItem('vernify_token');
    } catch (e) { }
    return res.ok;
}

export async function getDashboard(role) {
    const token = getToken();
    const res = await fetch(`${BASE_URL}/${role}/dashboard`, {
        method: 'GET',
        headers: {
            ..._authHeader(token),
        },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Dashboard fetch failed: ${res.status} ${text}`);
    }
    return _safeJsonParse(res);
}
