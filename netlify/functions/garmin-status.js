import { sql, jsonResponse } from './_lib/db.js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    try {
        if (event.httpMethod !== 'GET') {
            return jsonResponse({ error: 'Method not allowed' }, 405);
        }

        const url = new URL(event.rawUrl || `http://localhost${event.path}?${event.rawQuery || ''}`);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return jsonResponse({ error: true, message: 'userId is required' }, 400);
        }

        const [row] = await sql`
            SELECT display_name, connected_at FROM garmin_tokens WHERE user_id = ${userId}
        `;

        if (!row) {
            return jsonResponse({ connected: false });
        }

        return jsonResponse({
            connected: true,
            displayName: row.display_name,
            connectedAt: row.connected_at,
        });
    } catch (error) {
        console.error('Garmin status error:', error);
        return jsonResponse({ error: true, message: 'Failed to check Garmin status' }, 500);
    }
};
