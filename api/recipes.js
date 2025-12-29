import { sql, jsonResponse, handleDbError } from './_lib/db.js';

export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    try {
        const url = new URL(request.url);
        const filter = url.searchParams.get('filter') || 'all';

        if (request.method === 'GET') {
            let recipes;

            if (filter === 'all') {
                recipes = await sql`
          SELECT * FROM recipes ORDER BY id
        `;
            } else {
                recipes = await sql`
          SELECT * FROM recipes 
          WHERE ${filter} = ANY(tags)
          ORDER BY id
        `;
            }

            return jsonResponse({
                success: true,
                data: recipes
            });
        }

        return jsonResponse({ error: 'Method not allowed' }, 405);
    } catch (error) {
        return jsonResponse(handleDbError(error), 500);
    }
}
