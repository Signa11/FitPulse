// Local development server for API routes
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3001; // Different port from Vite

// Import API handlers dynamically
async function loadHandler(routePath) {
    const parts = routePath.split('/');
    
    // Try nested path first (e.g., auth/register, user/profile)
    if (parts.length >= 2) {
        try {
            const handlerPath = join(__dirname, 'api', parts[0], parts[1] + '.js');
            // Use file:// URL for proper module resolution
            const fileUrl = 'file://' + handlerPath;
            const module = await import(fileUrl);
            return module.default;
        } catch (error) {
            // Log but don't show to user unless debugging
            if (process.env.DEBUG) {
                console.error(`Failed to load nested handler ${routePath}:`, error.message);
            }
        }
    }
    
    // Try flat path (e.g., workouts, recipes)
    try {
        const handlerPath = join(__dirname, 'api', routePath + '.js');
        const fileUrl = 'file://' + handlerPath;
        const module = await import(fileUrl);
        return module.default;
    } catch (error) {
        if (process.env.DEBUG) {
            console.error(`Failed to load flat handler ${routePath}:`, error.message);
        }
        return null;
    }
}

function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', reject);
    });
}

const server = createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Handle Netlify-style functions (e.g., /api/garmin/*)
    if (pathname.startsWith('/api/garmin/')) {
        const funcName = 'garmin-' + pathname.replace('/api/garmin/', '');
        try {
            const funcPath = join(__dirname, 'netlify', 'functions', funcName + '.js');
            const funcUrl = 'file://' + funcPath;
            const module = await import(funcUrl);
            const body = await getRequestBody(req);
            const event = {
                httpMethod: req.method,
                body,
                path: pathname,
                rawUrl: `http://${req.headers.host || 'localhost:' + PORT}${req.url}`,
                rawQuery: url.search.replace('?', ''),
                headers: req.headers,
                queryStringParameters: Object.fromEntries(url.searchParams),
            };
            const response = await module.handler(event, {});
            const headers = response.headers || { 'Content-Type': 'application/json' };
            res.writeHead(response.statusCode || 200, headers);
            res.end(response.body || '');
        } catch (error) {
            console.error('Error handling Netlify function:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal server error', message: error.message }));
        }
        return;
    }

    // Handle API routes
    if (pathname.startsWith('/api/')) {
        const apiPath = pathname.replace('/api/', '');

        try {
            const handler = await loadHandler(apiPath);
            
            if (handler) {
                // Create a Request-like object for Vercel edge function compatibility
                const body = await getRequestBody(req);
                
                // Build full URL for API handlers that use new URL(request.url)
                const fullUrl = `http://${req.headers.host || 'localhost:' + PORT}${req.url}`;
                
                const request = {
                    method: req.method,
                    url: fullUrl,
                    headers: req.headers,
                    json: async () => {
                        if (!body) return {};
                        try {
                            return JSON.parse(body);
                        } catch (e) {
                            throw new Error('Invalid JSON');
                        }
                    },
                    text: async () => body,
                };

                const response = await handler(request);
                
                // Handle Response object (from jsonResponse helper)
                if (response instanceof Response) {
                    const status = response.status;
                    const headers = {};
                    response.headers.forEach((value, key) => {
                        headers[key] = value;
                    });
                    res.writeHead(status, headers);
                    const text = await response.text();
                    res.end(text);
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response));
                }
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'API route not found', path: apiPath }));
            }
        } catch (error) {
            console.error('Error handling request:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                error: 'Internal server error', 
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Local API server running on http://localhost:${PORT}`);
    console.log(`📡 API routes available at http://localhost:${PORT}/api/*`);
});

