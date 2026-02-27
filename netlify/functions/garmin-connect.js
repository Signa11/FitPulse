import { sql, jsonResponse, handleDbError } from './_lib/db.js';

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

        const { userId, garminEmail, garminPassword } = body;

        if (!userId || !garminEmail || !garminPassword) {
            return jsonResponse({ error: true, message: 'userId, garminEmail, and garminPassword are required' }, 400);
        }

        // Dynamic import - CJS module wraps under .default
        const mod = await import('garmin-connect');
        const GarminConnect = mod.GarminConnect || mod.default?.GarminConnect;
        const client = new GarminConnect({ username: garminEmail, password: garminPassword });

        await client.login();

        const tokens = client.exportToken();
        let displayName = garminEmail;
        try {
            const profile = await client.getUserProfile();
            displayName = profile?.displayName || profile?.userName || garminEmail;
        } catch (e) {
            // Profile fetch is optional, continue with email as name
        }

        // Upsert tokens into database
        await sql`
            INSERT INTO garmin_tokens (user_id, oauth1_token, oauth2_token, display_name, connected_at)
            VALUES (${userId}, ${JSON.stringify(tokens.oauth1)}, ${JSON.stringify(tokens.oauth2)}, ${displayName}, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                oauth1_token = ${JSON.stringify(tokens.oauth1)},
                oauth2_token = ${JSON.stringify(tokens.oauth2)},
                display_name = ${displayName},
                connected_at = NOW()
        `;

        return jsonResponse({
            success: true,
            displayName,
        });
    } catch (error) {
        console.error('Garmin connect error:', error);

        if (error.message?.includes('credentials') || error.message?.includes('401') || error.message?.includes('login')) {
            return jsonResponse({ error: true, message: 'Invalid Garmin email or password' }, 401);
        }

        return jsonResponse({
            error: true,
            message: error.message || 'Failed to connect to Garmin. Please try again.',
        }, 500);
    }
};
