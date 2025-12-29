import { neon } from '@neondatabase/serverless';

// Create a SQL query function using the DATABASE_URL
const sql = neon(process.env.DATABASE_URL);

export { sql };

// Helper function to handle database errors
export function handleDbError(error) {
    console.error('Database error:', error);
    return {
        error: true,
        message: error.message || 'An unexpected database error occurred',
        code: error.code || 'UNKNOWN_ERROR'
    };
}

// Helper to format response
export function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
