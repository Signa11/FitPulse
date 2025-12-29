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
        if (event.httpMethod === 'POST') {
            let body;
            try {
                body = JSON.parse(event.body || '{}');
            } catch (e) {
                return jsonResponse({
                    error: true,
                    message: 'Invalid request body. Please provide valid JSON.'
                }, 400);
            }
            
            const { email, password } = body;

            // Validate required fields
            if (!email || !password) {
                return jsonResponse({
                    error: true,
                    message: 'Email and password are required'
                }, 400);
            }

            // Find user by email
            const [user] = await sql`
                SELECT id, email, name, password_hash, avatar_url, level, points, streak, 
                       workouts_completed, recipes_cooked, member_since
                FROM users 
                WHERE email = ${email.toLowerCase()}
            `;

            if (!user) {
                return jsonResponse({
                    error: true,
                    message: 'Invalid email or password'
                }, 401);
            }

            // Check password (in production, compare hashed passwords!)
            if (user.password_hash !== password) {
                return jsonResponse({
                    error: true,
                    message: 'Invalid email or password'
                }, 401);
            }

            // Get user's badges
            const badges = await sql`
                SELECT b.id, b.name, b.icon, b.description
                FROM user_badges ub
                JOIN badges b ON ub.badge_id = b.id
                WHERE ub.user_id = ${user.id}
            `;

            return jsonResponse({
                success: true,
                message: 'Login successful!',
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
                    }),
                    badges: badges
                }
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
};

