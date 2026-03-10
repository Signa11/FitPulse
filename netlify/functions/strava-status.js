import { sql, jsonResponse } from './_lib/db.js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return jsonResponse({}, 200);
    }

    try {
        const { userId } = event.queryStringParameters || {};
        if (!userId) {
            return jsonResponse({ error: true, message: 'userId is required' }, 400);
        }

        const [row] = await sql`
            SELECT athlete_id, athlete_name, connected_at FROM strava_tokens WHERE user_id = ${userId}
        `;

        if (!row) {
            return jsonResponse({ connected: false });
        }

        return jsonResponse({
            connected: true,
            athleteName: row.athlete_name || 'Athlete',
            athleteId: row.athlete_id,
        });
    } catch (error) {
        console.error('Strava status error:', error);
        return jsonResponse({ error: true, message: error.message }, 500);
    }
};
