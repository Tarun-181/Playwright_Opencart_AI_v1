const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.MOCK_PORT || 5001;

const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'products.json'), 'utf8'));
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));
const cartsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'carts.json'), 'utf8'));

function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch {
                resolve(body);
            }
        });
    });
}

function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, User-Agent',
    });
    res.end(JSON.stringify(data));
}

function sendText(res, statusCode, text) {
    res.writeHead(statusCode, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
    });
    res.end(text);
}

const server = http.createServer(async (req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const query = Object.fromEntries(parsedUrl.searchParams.entries());
    const method = req.method;

    if (method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, User-Agent',
        });
        return res.end();
    }

    // 1. Authentication
    if (pathname === '/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        if (body && (body.username === 'mor_2314' || body.username === process.env.API_USERNAME) && (body.password === '83r5^_' || body.password === process.env.PASSWORD)) {
            return sendJson(res, 201, {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mockTokenForTestingPlaywright.opencartMock'
            });
        }
        return sendText(res, 401, 'username or password is incorrect');
    }

    // 2. Categories
    if (pathname === '/products/categories' && method === 'GET') {
        const categories = [...new Set(productsData.map(p => p.category))];
        return sendJson(res, 200, categories);
    }

    // 3. Products by Category
    if (pathname.startsWith('/products/category/') && method === 'GET') {
        const category = decodeURIComponent(pathname.replace('/products/category/', ''));
        const filtered = productsData.filter(p => p.category === category);
        return sendJson(res, 200, filtered);
    }

    // 4. Products CRUD & Query
    if (pathname === '/products') {
        if (method === 'GET') {
            let result = [...productsData];
            if (query.sort === 'desc') {
                result.sort((a, b) => b.id - a.id);
            } else if (query.sort === 'asc') {
                result.sort((a, b) => a.id - b.id);
            }
            if (query.limit) {
                result = result.slice(0, Number(query.limit));
            }
            return sendJson(res, 200, result);
        }
        if (method === 'POST') {
            const body = await parseBody(req);
            return sendJson(res, 201, { id: 21, ...(typeof body === 'object' ? body : {}) });
        }
    }

    const productMatch = pathname.match(/^\/products\/(\d+)$/);
    if (productMatch) {
        const id = Number(productMatch[1]);
        if (method === 'GET') {
            const item = productsData.find(p => p.id === id);
            return sendJson(res, 200, item || { id, title: 'Mock Product', price: 99.9, category: 'electronics', image: 'mock.png' });
        }
        if (method === 'PUT') {
            const body = await parseBody(req);
            return sendJson(res, 200, { id, ...(typeof body === 'object' ? body : {}) });
        }
        if (method === 'DELETE') {
            const item = productsData.find(p => p.id === id) || { id };
            return sendJson(res, 200, item);
        }
    }

    // 5. Users CRUD & Query
    if (pathname === '/users') {
        if (method === 'GET') {
            let result = [...usersData];
            if (query.sort === 'desc') {
                result.sort((a, b) => b.id - a.id);
            } else if (query.sort === 'asc') {
                result.sort((a, b) => a.id - b.id);
            }
            if (query.limit) {
                result = result.slice(0, Number(query.limit));
            }
            return sendJson(res, 200, result);
        }
        if (method === 'POST') {
            const body = await parseBody(req);
            return sendJson(res, 201, { id: 11, ...(typeof body === 'object' ? body : {}) });
        }
    }

    const userMatch = pathname.match(/^\/users\/(\d+)$/);
    if (userMatch) {
        const id = Number(userMatch[1]);
        if (method === 'GET') {
            const item = usersData.find(u => u.id === id);
            return sendJson(res, 200, item || { id, username: 'mockuser', email: 'mock@example.com' });
        }
        if (method === 'PUT') {
            const body = await parseBody(req);
            return sendJson(res, 200, { id, ...(typeof body === 'object' ? body : {}) });
        }
        if (method === 'DELETE') {
            const item = usersData.find(u => u.id === id) || { id };
            return sendJson(res, 200, item);
        }
    }

    // 6. Carts CRUD & Query
    if (pathname === '/carts') {
        if (method === 'GET') {
            let result = [...cartsData];
            if (query.startDate && query.endDate) {
                result = result.filter(c => c.date >= query.startDate && c.date <= query.endDate);
            }
            if (query.sort === 'desc') {
                result.sort((a, b) => b.id - a.id);
            } else if (query.sort === 'asc') {
                result.sort((a, b) => a.id - b.id);
            }
            if (query.limit) {
                result = result.slice(0, Number(query.limit));
            }
            return sendJson(res, 200, result);
        }
        if (method === 'POST') {
            const body = await parseBody(req);
            return sendJson(res, 201, { id: 8, ...(typeof body === 'object' ? body : {}) });
        }
    }

    const userCartMatch = pathname.match(/^\/carts\/user\/(\d+)$/);
    if (userCartMatch && method === 'GET') {
        const userId = Number(userCartMatch[1]);
        const filtered = cartsData.filter(c => c.userId === userId);
        return sendJson(res, 200, filtered);
    }

    const cartMatch = pathname.match(/^\/carts\/(\d+)$/);
    if (cartMatch) {
        const id = Number(cartMatch[1]);
        if (method === 'GET') {
            const item = cartsData.find(c => c.id === id);
            return sendJson(res, 200, item || { id, userId: 1, date: '2020-01-01', products: [] });
        }
        if (method === 'PUT') {
            const body = await parseBody(req);
            return sendJson(res, 200, { id, ...(typeof body === 'object' ? body : {}) });
        }
        if (method === 'DELETE') {
            const item = cartsData.find(c => c.id === id) || { id };
            return sendJson(res, 200, item);
        }
    }

    // Health check
    if (pathname === '/health' || pathname === '/') {
        return sendJson(res, 200, { status: 'ok', mockServer: 'FakeStoreAPI Mock' });
    }

    return sendText(res, 404, 'Not Found');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Mock FakeStoreAPI server running on http://127.0.0.1:${PORT}`);
});
