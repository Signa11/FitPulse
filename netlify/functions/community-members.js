import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return jsonResponse('', 200);
    }

    if (event.httpMethod !== 'GET') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const members = await sql`
            SELECT id, name, avatar_url, level, points, streak,
                   workouts_completed, member_since
            FROM users
            ORDER BY points DESC, created_at ASC
        `;

        return jsonResponse({
            success: true,
            data: members.map(m => ({
                id: m.id,
                name: m.name,
                avatar: m.avatar_url,
                level: m.level,
                points: m.points,
                streak: m.streak,
                workoutsCompleted: m.workouts_completed,
                memberSince: m.member_since,
            })),
        });
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
};
