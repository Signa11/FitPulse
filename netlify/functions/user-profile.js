import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
            body: '',
        };
    }

    try {
        // Get user ID from query string or body (in production, get from auth token)
        // For now, we'll get it from the request
        let userId = event.queryStringParameters?.userId;
        
        if (event.httpMethod === 'GET') {
            if (!userId) {
                return jsonResponse({ error: 'User ID is required' }, 400);
            }

            // Get user profile
            const [user] = await sql`
                SELECT id, email, name, avatar_url, level, points, streak, 
                       workouts_completed, recipes_cooked, member_since
                FROM users 
                WHERE id = ${userId}
            `;

            if (!user) {
                return jsonResponse({ error: 'User not found' }, 404);
            }

            return jsonResponse({
                success: true,
                data: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar_url,
                    level: user.level,
                    points: user.points,
                    streak: user.streak,
                    workoutsCompleted: user.workouts_completed,
                    recipesCooked: user.recipes_cooked,
                    memberSince: new Date(user.member_since).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                    })
                }
            });
        }

        if (event.httpMethod === 'PATCH') {
            let body;
            try {
                body = JSON.parse(event.body || '{}');
            } catch (e) {
                return jsonResponse({
                    error: true,
                    message: 'Invalid request body. Please provide valid JSON.'
                }, 400);
            }

            const { userId: bodyUserId, name, avatar_url } = body;
            userId = userId || bodyUserId;

            if (!userId) {
                return jsonResponse({ error: 'User ID is required' }, 400);
            }

            const [updated] = await sql`
                UPDATE users 
                SET 
                    name = COALESCE(${name}, name),
                    avatar_url = COALESCE(${avatar_url}, avatar_url)
                WHERE id = ${userId}
                RETURNING id, email, name, avatar_url, level, points, streak
            `;

            if (!updated) {
                return jsonResponse({ error: 'User not found' }, 404);
            }

            return jsonResponse({
                success: true,
                data: {
                    id: updated.id,
                    email: updated.email,
                    name: updated.name,
                    avatar: updated.avatar_url,
                    level: updated.level,
                    points: updated.points,
                    streak: updated.streak
                }
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
};

