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

        const { userId, garminEmail, garminPassword } = body;

        if (!userId || !garminEmail || !garminPassword) {
            return jsonResponse({ error: true, message: 'userId, garminEmail, and garminPassword are required' }, 400);
        }

        // Dynamic import - CJS module wraps under .default
        const mod = await import('@gooin/garmin-connect');
        const GarminConnect = mod.GarminConnect || mod.default?.GarminConnect;
        const gc = new GarminConnect({
            username: garminEmail,
            password: garminPassword,
            timeout: 15000,
        });

        // Access the internal HttpClient to drive the SSO flow step by step
        const httpClient = gc.client;

        // Step 0: Fetch OAuth consumer keys
        await httpClient.fetchOauthConsumer();

        // Steps 1-3: Cookie setup, CSRF, submit credentials
        const loginParams = httpClient.prepareLoginParams();
        await httpClient.performLoginStep1(loginParams.step1Params);
        const csrfToken = await httpClient.performLoginStep2(loginParams.step2Params);
        let signinResult = await httpClient.performLoginStep3(
            garminEmail, garminPassword, csrfToken, loginParams.step3Params
        );

        // Check for account lockout
        httpClient.handleAccountLocked(signinResult);

        // Check if MFA is required
        const pageTitle = httpClient.handlePageTitle(signinResult);
        if (httpClient.isMFARequired(pageTitle)) {
            // MFA is required — save session state to DB so the user can
            // submit their code in a second request
            const axiosJar = httpClient.client.defaults.jar;
            const serializedJar = axiosJar.serializeSync();

            const [session] = await sql`
                INSERT INTO garmin_mfa_sessions (user_id, cookie_jar, signin_html, signin_params, created_at)
                VALUES (
                    ${userId},
                    ${JSON.stringify(serializedJar)},
                    ${signinResult},
                    ${JSON.stringify({
                        step3Params: loginParams.step3Params,
                        oauthConsumer: httpClient.OAUTH_CONSUMER,
                    })},
                    NOW()
                )
                RETURNING session_id
            `;

            return jsonResponse({
                mfaRequired: true,
                sessionId: session.session_id,
                message: 'A verification code has been sent to your email. Please enter it to complete the connection.',
            });
        }

        // No MFA — extract ticket and complete OAuth flow
        const ticket = httpClient.extractTicket(signinResult);
        if (!ticket) {
            return jsonResponse({ error: true, message: 'Login failed. Please check your email and password.' }, 401);
        }

        const oauth1 = await httpClient.getOauth1Token(ticket);
        await httpClient.exchange(oauth1);

        const tokens = gc.exportToken();
        let displayName = garminEmail;
        try {
            const profile = await gc.getUserProfile();
            displayName = profile?.displayName || profile?.userName || garminEmail;
        } catch (e) {
            // Profile fetch is optional
        }

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
        console.error('Garmin connect error:', error);

        const msg = error.message || '';
        if (msg.includes('locked') || msg.includes('Locked')) {
            return jsonResponse({ error: true, message: 'Your Garmin account is temporarily locked. Please try again later.' }, 423);
        }
        if (msg.includes('credentials') || msg.includes('用户名和密码') || msg.includes('login failed')) {
            return jsonResponse({ error: true, message: 'Invalid Garmin email or password.' }, 401);
        }

        return jsonResponse({
            error: true,
            message: 'Failed to connect to Garmin. Please try again.',
        }, 500);
    }
};
