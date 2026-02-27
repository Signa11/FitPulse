import { sql, jsonResponse } from './_lib/db.js';
import { workoutToGarminJSON } from './_lib/garminConverter.js';

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

        const { userId, workout, scheduleDate } = body;

        if (!userId || !workout) {
            return jsonResponse({ error: true, message: 'userId and workout are required' }, 400);
        }

        if (!workout.steps || workout.steps.length === 0) {
            return jsonResponse({ error: true, message: 'Workout must have at least one step' }, 400);
        }

        // Load stored tokens
        const [row] = await sql`
            SELECT oauth1_token, oauth2_token FROM garmin_tokens WHERE user_id = ${userId}
        `;

        if (!row) {
            return jsonResponse({
                error: true,
                message: 'Garmin account not connected',
                code: 'NOT_CONNECTED',
            }, 401);
        }

        const oauth1 = typeof row.oauth1_token === 'string' ? JSON.parse(row.oauth1_token) : row.oauth1_token;
        const oauth2 = typeof row.oauth2_token === 'string' ? JSON.parse(row.oauth2_token) : row.oauth2_token;

        // Create client with stored tokens
        const mod = await import('@gooin/garmin-connect');
        const GarminConnect = mod.GarminConnect || mod.default?.GarminConnect;
        const client = new GarminConnect({ username: 'token-auth', password: 'token-auth' });
        client.loadToken(oauth1, oauth2);

        // Convert workout to Garmin format
        const garminWorkout = workoutToGarminJSON(workout);

        // Send to Garmin
        let result;
        try {
            result = await client.addWorkout(garminWorkout);
        } catch (apiError) {
            const status = apiError.response?.status || apiError.status;
            const detail = apiError.response?.data || apiError.message;
            console.error('Garmin addWorkout error:', status, JSON.stringify(detail));

            if (status === 401 || apiError.message?.includes('401')) {
                return jsonResponse({
                    error: true,
                    message: 'Garmin session expired. Please reconnect your Garmin account.',
                    code: 'TOKEN_EXPIRED',
                }, 401);
            }

            return jsonResponse({
                error: true,
                message: `Garmin rejected the workout: ${typeof detail === 'string' ? detail : JSON.stringify(detail) || apiError.message}`,
            }, 502);
        }

        // Schedule to a specific date if requested
        if (scheduleDate && result?.workoutId) {
            try {
                await client.scheduleWorkout(
                    { workoutId: String(result.workoutId) },
                    new Date(scheduleDate)
                );
            } catch (schedErr) {
                console.error('Garmin schedule error:', schedErr.message);
                // Non-critical — workout was created, just not scheduled
            }
        }

        // Update stored tokens (they may have been refreshed)
        try {
            const updatedTokens = client.exportToken();
            await sql`
                UPDATE garmin_tokens
                SET oauth2_token = ${JSON.stringify(updatedTokens.oauth2)}
                WHERE user_id = ${userId}
            `;
        } catch (e) {
            // Non-critical
        }

        return jsonResponse({
            success: true,
            garminWorkoutId: result?.workoutId || null,
            scheduled: !!scheduleDate,
            message: scheduleDate
                ? `Workout sent and scheduled for ${scheduleDate}!`
                : 'Workout sent to Garmin Connect!',
        });
    } catch (error) {
        console.error('Garmin send workout error:', error);
        return jsonResponse({
            error: true,
            message: error.message || 'Failed to send workout to Garmin',
        }, 500);
    }
};
