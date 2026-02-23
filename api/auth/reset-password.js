import { sql, jsonResponse, handleDbError } from '../_lib/db.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        if (request.method === 'POST') {
            let body;
            try {
                body = await request.json();
            } catch (e) {
                return jsonResponse({
                    error: true,
                    message: 'Invalid request body. Please provide valid JSON.'
                }, 400);
            }

            const { email, newPassword } = body;

            if (!email || !newPassword) {
                return jsonResponse({
                    error: true,
                    message: 'Email and new password are required'
                }, 400);
            }

            if (newPassword.length < 6) {
                return jsonResponse({
                    error: true,
                    message: 'Password must be at least 6 characters'
                }, 400);
            }

            // Check user exists
            const [user] = await sql`
                SELECT id FROM users WHERE email = ${email.toLowerCase()}
            `;

            if (!user) {
                // Don't reveal whether email exists
                return jsonResponse({
                    success: true,
                    message: 'If an account with that email exists, the password has been reset.'
                });
            }

            // Update password
            await sql`
                UPDATE users SET password_hash = ${newPassword} WHERE id = ${user.id}
            `;

            return jsonResponse({
                success: true,
                message: 'Password has been reset successfully. You can now sign in.'
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
}
