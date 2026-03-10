import { jsonResponse } from './_lib/db.js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return jsonResponse({}, 200);
    }

    try {
        const { userId } = event.queryStringParameters || {};
        if (!userId) {
            return jsonResponse({ error: true, message: 'userId is required' }, 400);
        }

        const clientId = process.env.STRAVA_CLIENT_ID;
        if (!clientId) {
            return jsonResponse({ error: true, message: 'Strava not configured' }, 500);
        }

        // Build the Strava OAuth authorization URL
        const redirectUri = `${process.env.URL || 'https://movelab.netlify.app'}/api/strava/callback`;
        const scope = 'activity:read_all';
        const state = Buffer.from(JSON.stringify({ userId })).toString('base64url');

        const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&approval_prompt=auto`;

        return jsonResponse({ authUrl });
    } catch (error) {
        console.error('Strava connect error:', error);
        return jsonResponse({ error: true, message: error.message }, 500);
    }
};
