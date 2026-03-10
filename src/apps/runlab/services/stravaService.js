const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function stravaFetch(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    const text = await response.text();
    if (!text) throw new Error('Server returned an empty response');

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        throw new Error('Unable to reach the server. Please try again later.');
    }

    if (!response.ok) {
        const err = new Error(data.message || 'Request failed');
        err.code = data.code;
        throw err;
    }

    return data;
}

export async function getStravaAuthUrl(userId) {
    return stravaFetch(`/strava/connect?userId=${encodeURIComponent(userId)}`);
}

export async function checkStravaStatus(userId) {
    return stravaFetch(`/strava/status?userId=${encodeURIComponent(userId)}`);
}

export async function disconnectStrava(userId) {
    return stravaFetch('/strava/disconnect', {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });
}

export async function getStravaActivities(userId, after) {
    const params = new URLSearchParams({ userId });
    if (after) params.set('after', after);
    return stravaFetch(`/strava/activities?${params.toString()}`);
}
