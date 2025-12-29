import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const url = new URL(request.url);
        const limit = parseInt(url.searchParams.get('limit')) || 20;

        if (request.method === 'GET') {
            // Get recent activities with user info and counts
            const activities = await sql`
        SELECT 
          ua.id,
          ua.action,
          ua.target,
          ua.target_type,
          ua.created_at,
          u.name as user_name,
          u.avatar_url as user_avatar,
          COALESCE(
            (SELECT COUNT(*) FROM activity_likes al WHERE al.activity_id = ua.id),
            0
          ) as likes,
          COALESCE(
            (SELECT COUNT(*) FROM activity_comments ac WHERE ac.activity_id = ua.id),
            0
          ) as comments
        FROM user_activities ua
        JOIN users u ON ua.user_id = u.id
        ORDER BY ua.created_at DESC
        LIMIT ${limit}
      `;

            // Format user names for privacy (First Name + Last Initial)
            const formattedActivities = activities.map(activity => {
                const nameParts = activity.user_name.split(' ');
                const displayName = nameParts.length > 1
                    ? `${nameParts[0]} ${nameParts[1][0]}.`
                    : nameParts[0];

                return {
                    ...activity,
                    user: displayName,
                    avatar: activity.user_avatar,
                    timestamp: formatTimeAgo(new Date(activity.created_at))
                };
            });

            return jsonResponse({
                success: true,
                data: formattedActivities
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
}

// Helper to format relative time
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
}
