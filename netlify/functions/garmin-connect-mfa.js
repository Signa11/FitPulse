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

        const { userId, sessionId, mfaCode } = body;

        if (!userId || !sessionId || !mfaCode) {
            return jsonResponse({ error: true, message: 'userId, sessionId, and mfaCode are required' }, 400);
        }

        // Load the saved MFA session
        const [session] = await sql`
            SELECT cookie_jar, signin_html, signin_params
            FROM garmin_mfa_sessions
            WHERE session_id = ${sessionId} AND user_id = ${userId}
        `;

        if (!session) {
            return jsonResponse({
                error: true,
                message: 'MFA session expired or not found. Please try connecting again.',
            }, 404);
        }

        // Clean up the session immediately (one-time use)
        await sql`DELETE FROM garmin_mfa_sessions WHERE session_id = ${sessionId}`;

        const cookieJarData = typeof session.cookie_jar === 'string'
            ? JSON.parse(session.cookie_jar) : session.cookie_jar;
        const signinHtml = session.signin_html;
        const savedParams = typeof session.signin_params === 'string'
            ? JSON.parse(session.signin_params) : session.signin_params;

        // Recreate the GarminConnect client with restored cookies
        const mod = await import('@gooin/garmin-connect');
        const GarminConnect = mod.GarminConnect || mod.default?.GarminConnect;
        const gc = new GarminConnect({ username: 'mfa-session', password: 'mfa-session', timeout: 15000 });
        const httpClient = gc.client;

        // Restore the cookie jar
        const { CookieJar } = await import('tough-cookie');
        const restoredJar = CookieJar.deserializeSync(cookieJarData);
        httpClient.client.defaults.jar = restoredJar;

        // Restore OAuth consumer
        httpClient.OAUTH_CONSUMER = savedParams.oauthConsumer;

        // Submit the MFA code using the saved HTML + cookies
        const mfaResult = await httpClient.handleMFAWithCode(
            signinHtml,
            savedParams.step3Params,
            mfaCode.trim()
        );

        // Extract ticket from MFA result
        const ticket = httpClient.extractTicket(mfaResult);
        if (!ticket) {
            return jsonResponse({
                error: true,
                message: 'Invalid verification code. Please try connecting again.',
            }, 401);
        }

        // Complete OAuth flow: ticket → OAuth1 → OAuth2
        const oauth1 = await httpClient.getOauth1Token(ticket);
        await httpClient.exchange(oauth1);

        const tokens = gc.exportToken();
        let displayName = 'Garmin User';
        try {
            const profile = await gc.getUserProfile();
            displayName = profile?.displayName || profile?.userName || displayName;
        } catch (e) {
            // Profile fetch is optional
        }

        // Save tokens
        await sql`
            INSERT INTO garmin_tokens (user_id, oauth1_token, oauth2_token, display_name, connected_at)
            VALUES (${userId}, ${JSON.stringify(tokens.oauth1)}, ${JSON.stringify(tokens.oauth2)}, ${displayName}, NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                oauth1_token = ${JSON.stringify(tokens.oauth1)},
                oauth2_token = ${JSON.stringify(tokens.oauth2)},
                display_name = ${displayName},
                connected_at = NOW()
        `;

        return jsonResponse({ success: true, displayName });
    } catch (error) {
        console.error('Garmin MFA error:', error);

        const msg = error.message || '';
        if (msg.includes('CSRF') || msg.includes('expired') || msg.includes('session')) {
            return jsonResponse({
                error: true,
                message: 'Session expired. Please try connecting again from the beginning.',
            }, 410);
        }

        return jsonResponse({
            error: true,
            message: 'Verification failed. Please try connecting again.',
        }, 500);
    }
};
