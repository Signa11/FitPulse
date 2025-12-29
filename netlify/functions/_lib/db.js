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

// Helper to format response for Netlify Functions
export function jsonResponse(data, status = 200) {
    return {
        statusCode: status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: JSON.stringify(data),
    };
}

