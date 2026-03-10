import { sql, jsonResponse } from './_lib/db.js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return jsonResponse({}, 200);
    }

    try {
        if (event.httpMethod !== 'POST') {
            return jsonResponse({ error: 'Method not allowed' }, 405);
        }

        const body = JSON.parse(event.body || '{}');
        const { userId } = body;

        if (!userId) {
            return jsonResponse({ error: true, message: 'userId is required' }, 400);
        }

        // Optionally deauthorize on Strava's side
        const [row] = await sql`
            SELECT access_token FROM strava_tokens WHERE user_id = ${userId}
        `;

        if (row?.access_token) {
            try {
                await fetch('https://www.strava.com/oauth/deauthorize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `access_token=${row.access_token}`,
                });
            } catch {
                // Non-critical
            }
        }

        await sql`DELETE FROM strava_tokens WHERE user_id = ${userId}`;

        return jsonResponse({ success: true });
    } catch (error) {
        console.error('Strava disconnect error:', error);
        return jsonResponse({ error: true, message: error.message }, 500);
    }
};
