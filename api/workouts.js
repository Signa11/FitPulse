import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        if (request.method === 'GET') {
            // Get all workouts grouped by category
            const workouts = await sql`
        SELECT 
          w.*,
          wc.name as category_name,
          wc.icon as category_icon
        FROM workouts w
        LEFT JOIN workout_categories wc ON w.category_id = wc.id
        ORDER BY wc.sort_order, w.id
      `;

            // Group by category
            const grouped = workouts.reduce((acc, workout) => {
                const categoryId = workout.category_id;
                if (!acc[categoryId]) {
                    acc[categoryId] = {
                        id: categoryId,
                        name: workout.category_name,
                        icon: workout.category_icon,
                        workouts: []
                    };
                }
                acc[categoryId].workouts.push(workout);
                return acc;
            }, {});

            return jsonResponse({
                success: true,
                data: Object.values(grouped)
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
}
