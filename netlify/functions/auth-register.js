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
            
            const { email, name, password } = body;

            // Validate required fields
            if (!email || !name || !password) {
                return jsonResponse({
                    error: true,
                    message: 'Email, name, and password are required'
                }, 400);
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return jsonResponse({
                    error: true,
                    message: 'Please enter a valid email address'
                }, 400);
            }

            // Validate password length
            if (password.length < 6) {
                return jsonResponse({
                    error: true,
                    message: 'Password must be at least 6 characters'
                }, 400);
            }

            // Check if user already exists
            const existing = await sql`
                SELECT id FROM users WHERE email = ${email.toLowerCase()}
            `;

            if (existing.length > 0) {
                return jsonResponse({
                    error: true,
                    message: 'An account with this email already exists'
                }, 409);
            }

            // Create the user
            // Note: In production, you should hash the password!
            // For demo purposes, we're storing it as-is
            const [newUser] = await sql`
                INSERT INTO users (email, name, password_hash, avatar_url)
                VALUES (
                    ${email.toLowerCase()}, 
                    ${name}, 
                    ${password},
                    ${'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(email)}
                )
                RETURNING id, email, name, avatar_url, level, points, streak
            `;

            return jsonResponse({
                success: true,
                message: 'Account created successfully!',
                data: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    avatar: newUser.avatar_url,
                    level: newUser.level,
                    points: newUser.points,
                    streak: newUser.streak
                }
            }, 201);
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
};

