import { sql, jsonResponse } from './_lib/db.js';

export const handler = async (event) => {
    try {
        const { code, state, error: oauthError } = event.queryStringParameters || {};

        const baseUrl = process.env.URL || 'https://movelab.netlify.app';

        if (oauthError) {
            return {
                statusCode: 302,
                headers: { Location: `${baseUrl}/runlab?strava=error&reason=${oauthError}` },
                body: '',
            };
        }

        if (!code || !state) {
            return {
                statusCode: 302,
                headers: { Location: `${baseUrl}/runlab?strava=error&reason=missing_params` },
                body: '',
            };
        }

        // Decode state
        let userId;
        try {
            const decoded = JSON.parse(Buffer.from(state, 'base64url').toString());
            userId = decoded.userId;
        } catch {
            return {
                statusCode: 302,
                headers: { Location: `${baseUrl}/runlab?strava=error&reason=invalid_state` },
                body: '',
            };
        }

        // Exchange code for tokens
        const tokenRes = await fetch('https://www.strava.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client_id: process.env.STRAVA_CLIENT_ID,
                client_secret: process.env.STRAVA_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
            }),
        });

        if (!tokenRes.ok) {
            const errText = await tokenRes.text();
            console.error('Strava token exchange failed:', errText);
            return {
                statusCode: 302,
                headers: { Location: `${baseUrl}/runlab?strava=error&reason=token_exchange` },
                body: '',
            };
        }

        const tokenData = await tokenRes.json();
        const { access_token, refresh_token, expires_at, athlete } = tokenData;

        // Upsert into strava_tokens
        await sql`
            INSERT INTO strava_tokens (user_id, athlete_id, access_token, refresh_token, expires_at, athlete_name)
            VALUES (${userId}, ${athlete?.id}, ${access_token}, ${refresh_token}, ${expires_at}, ${athlete?.firstname || 'Athlete'})
            ON CONFLICT (user_id) DO UPDATE SET
                athlete_id = EXCLUDED.athlete_id,
                access_token = EXCLUDED.access_token,
                refresh_token = EXCLUDED.refresh_token,
                expires_at = EXCLUDED.expires_at,
                athlete_name = EXCLUDED.athlete_name,
                connected_at = NOW()
        `;

        return {
            statusCode: 302,
            headers: { Location: `${baseUrl}/runlab?strava=connected` },
            body: '',
        };
    } catch (error) {
        console.error('Strava callback error:', error);
        const baseUrl = process.env.URL || 'https://movelab.netlify.app';
        return {
            statusCode: 302,
            headers: { Location: `${baseUrl}/runlab?strava=error&reason=server_error` },
            body: '',
        };
    }
};
