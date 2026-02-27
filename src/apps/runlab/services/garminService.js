const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function garminFetch(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });

    const text = await response.text();
    if (!text) throw new Error('Server returned an empty response');

    let data;
    try {
        data = JSON.parse(text);
    } catch (e) {
        throw new Error('Unable to reach the server. Please try again later.');
    }

    if (!response.ok) {
        const err = new Error(data.message || 'Request failed');
        err.code = data.code;
        throw err;
    }

    return data;
}

export async function checkGarminStatus(userId) {
    return garminFetch(`/garmin/status?userId=${encodeURIComponent(userId)}`);
}

export async function connectGarmin(userId, garminEmail, garminPassword) {
    return garminFetch('/garmin/connect', {
        method: 'POST',
        body: JSON.stringify({ userId, garminEmail, garminPassword }),
    });
}

export async function submitGarminMFA(userId, sessionId, mfaCode) {
    return garminFetch('/garmin/connect-mfa', {
        method: 'POST',
        body: JSON.stringify({ userId, sessionId, mfaCode }),
    });
}

export async function disconnectGarmin(userId) {
    return garminFetch('/garmin/disconnect', {
        method: 'POST',
        body: JSON.stringify({ userId }),
    });
}

export async function sendWorkoutToGarmin(userId, workout, scheduleDate) {
    return garminFetch('/garmin/send-workout', {
        method: 'POST',
        body: JSON.stringify({ userId, workout, scheduleDate: scheduleDate || undefined }),
    });
}
