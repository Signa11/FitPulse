import { sql, jsonResponse } from './_lib/db.js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    try {
        if (event.httpMethod !== 'POST') {
            return jsonResponse({ error: 'Method not allowed' }, 405);
        }

        let body;
        try {
            body = JSON.parse(event.body || '{}');
        } catch (e) {
            return jsonResponse({ error: true, message: 'Invalid request body' }, 400);
        }

        const { userId } = body;

        if (!userId) {
            return jsonResponse({ error: true, message: 'userId is required' }, 400);
        }

        await sql`DELETE FROM garmin_tokens WHERE user_id = ${userId}`;

        return jsonResponse({ success: true, message: 'Garmin account disconnected' });
    } catch (error) {
        console.error('Garmin disconnect error:', error);
        return jsonResponse({ error: true, message: 'Failed to disconnect Garmin' }, 500);
    }
};
