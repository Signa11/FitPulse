import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return jsonResponse('', 200);
    }

    try {
        if (event.httpMethod === 'GET') {
            const limit = parseInt(event.queryStringParameters?.limit) || 30;

            const activities = await sql`
                SELECT a.id, a.action, a.target, a.target_type, a.created_at,
                       u.id AS user_id, u.name AS user_name, u.avatar_url
                FROM user_activities a
                JOIN users u ON u.id = a.user_id
                ORDER BY a.created_at DESC
                LIMIT ${limit}
            `;

            return jsonResponse({
                success: true,
                data: activities.map(a => ({
                    id: a.id,
                    action: a.action,
                    target: a.target,
                    targetType: a.target_type,
                    createdAt: a.created_at,
                    user: {
                        id: a.user_id,
                        name: a.user_name,
                        avatar: a.avatar_url,
                    },
                })),
            });
        }

        if (event.httpMethod === 'POST') {
            let body;
            try {
                body = JSON.parse(event.body || '{}');
            } catch {
                return jsonResponse({ error: 'Invalid JSON' }, 400);
            }

            const { userId, action, target, targetType } = body;

            if (!userId || !action || !target || !targetType) {
                return jsonResponse({ error: 'userId, action, target, targetType are required' }, 400);
            }

            const [activity] = await sql`
                INSERT INTO user_activities (user_id, action, target, target_type)
                VALUES (${userId}, ${action}, ${target}, ${targetType})
                RETURNING id, action, target, target_type, created_at
            `;

            return jsonResponse({ success: true, data: activity });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
};
