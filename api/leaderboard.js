import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit')) || 10;

        if (request.method === 'GET') {
            const users = await sql`
        SELECT 
          id,
          name,
          avatar_url,
          points
        FROM users 
        ORDER BY points DESC
        LIMIT ${limit}
      `;

            // Format for leaderboard display
            const leaderboard = users.map((user, index) => {
                const nameParts = user.name.split(' ');
                const displayName = nameParts.length > 1
                    ? `${nameParts[0]} ${nameParts[1][0]}.`
                    : nameParts[0];

                return {
                    rank: index + 1,
                    name: displayName,
                    avatar: user.avatar_url,
                    points: user.points
                };
            });

            return jsonResponse({
                success: true,
                data: leaderboard
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
}
