import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        if (request.method === 'GET') {
            const challenges = await sql`
        SELECT * FROM challenges 
        WHERE is_active = true
        ORDER BY start_date
      `;

            return jsonResponse({
                success: true,
                data: challenges
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
}
