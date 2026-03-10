import { sql, jsonResponse } from './_lib/db.js';

async function refreshToken(userId, refreshToken) {
    const res = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
        }),
    });

    if (!res.ok) {
        throw new Error('Failed to refresh Strava token');
    }

    const data = await res.json();

    await sql`
        UPDATE strava_tokens
        SET access_token = ${data.access_token},
            refresh_token = ${data.refresh_token},
            expires_at = ${data.expires_at}
        WHERE user_id = ${userId}
    `;

    return data.access_token;
}

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return jsonResponse({}, 200);
    }

    try {
        const { userId, after, page } = event.queryStringParameters || {};
        if (!userId) {
            return jsonResponse({ error: true, message: 'userId is required' }, 400);
        }

        const [row] = await sql`
            SELECT access_token, refresh_token, expires_at FROM strava_tokens WHERE user_id = ${userId}
        `;

        if (!row) {
            return jsonResponse({ error: true, message: 'Strava not connected', code: 'NOT_CONNECTED' }, 401);
        }

        // Refresh token if expired
        let accessToken = row.access_token;
        const now = Math.floor(Date.now() / 1000);
        if (row.expires_at && row.expires_at < now + 60) {
            accessToken = await refreshToken(userId, row.refresh_token);
        }

        // Fetch activities
        const params = new URLSearchParams({
            per_page: '30',
            page: page || '1',
        });
        if (after) {
            params.set('after', String(Math.floor(new Date(after).getTime() / 1000)));
        }

        const activitiesRes = await fetch(
            `https://www.strava.com/api/v3/athlete/activities?${params.toString()}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!activitiesRes.ok) {
            if (activitiesRes.status === 401) {
                return jsonResponse({ error: true, message: 'Strava token expired', code: 'TOKEN_EXPIRED' }, 401);
            }
            throw new Error(`Strava API error: ${activitiesRes.status}`);
        }

        const activities = await activitiesRes.json();

        // Filter to running activities and return simplified data
        const runs = activities
            .filter(a => a.type === 'Run' || a.type === 'VirtualRun')
            .map(a => ({
                id: a.id,
                name: a.name,
                distance: Math.round(a.distance), // meters
                time: a.moving_time, // seconds
                avgPace: a.distance > 0 ? Math.round(a.moving_time / (a.distance / 1000)) : null, // sec/km
                avgHR: a.average_heartrate || null,
                maxHR: a.max_heartrate || null,
                date: a.start_date_local?.split('T')[0],
                elevationGain: a.total_elevation_gain,
            }));

        return jsonResponse({ activities: runs });
    } catch (error) {
        console.error('Strava activities error:', error);
        return jsonResponse({ error: true, message: error.message }, 500);
    }
};
