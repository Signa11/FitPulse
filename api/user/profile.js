import { sql, jsonResponse, handleDbError } from '../_lib/db.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        // For demo, we'll use a hardcoded user ID
        // In production, this would come from authentication
        const userId = '550e8400-e29b-41d4-a716-446655440000';

        if (request.method === 'GET') {
            // Get user profile with badges
            const [user] = await sql`
        SELECT 
          u.*,
          (
            SELECT json_agg(json_build_object(
              'id', b.id,
              'name', b.name,
              'icon', b.icon,
              'description', b.description,
              'earned_at', ub.earned_at
            ))
            FROM user_badges ub
            JOIN badges b ON ub.badge_id = b.id
            WHERE ub.user_id = u.id
          ) as badges,
          (
            SELECT json_agg(json_build_object(
              'id', c.id,
              'title', c.title,
              'duration', c.duration,
              'current_day', uc.current_day,
              'image_url', c.image_url,
              'reward', c.reward
            ))
            FROM user_challenges uc
            JOIN challenges c ON uc.challenge_id = c.id
            WHERE uc.user_id = u.id AND uc.completed_at IS NULL
          ) as active_challenges
        FROM users u
        WHERE u.id = ${userId}
      `;

            if (!user) {
                return jsonResponse({ error: 'User not found' }, 404);
            }

            return jsonResponse({
                success: true,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar_url,
                    level: user.level,
                    points: user.points,
                    streak: user.streak,
                    workoutsCompleted: user.workouts_completed,
                    recipesCooked: user.recipes_cooked,
                    memberSince: new Date(user.member_since).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    }),
                    badges: user.badges || [],
                    activeChallenges: user.active_challenges || []
                }
            });
        }

        if (request.method === 'PATCH') {
            let body;
            try {
                body = await request.json();
            } catch (e) {
                return jsonResponse({
                    error: true,
                    message: 'Invalid request body. Please provide valid JSON.'
                }, 400);
            }
            const { name, avatar_url } = body;

            const [updated] = await sql`
        UPDATE users 
        SET 
          name = COALESCE(${name}, name),
          avatar_url = COALESCE(${avatar_url}, avatar_url)
        WHERE id = ${userId}
        RETURNING *
      `;

            return jsonResponse({
                success: true,
                data: updated
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
}
