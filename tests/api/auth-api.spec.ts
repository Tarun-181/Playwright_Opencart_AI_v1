import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config({ override: true });

import { routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

test.describe('Authentication API Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || (process.env.CI ? 'http://127.0.0.1:5001' : 'https://fakestoreapi.com');
    const USERNAME = process.env.API_USERNAME || (process.env.USERNAME && process.env.USERNAME !== 'runneradmin' ? process.env.USERNAME : 'mor_2314');
    const PASSWORD = process.env.PASSWORD || '83r5^_';

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${routes.AUTH_LOGIN}`, {
            data: {
                username: USERNAME,
                password: PASSWORD,
            },
        });

        expect(response.status(), 'Expected status code to be 201 for successful login').toBe(201);

        const responseBody = await response.json();

        expect(responseBody).toHaveProperty('token');
        expect(typeof responseBody.token, 'Expected token to be a string').toBe('string');
        expect(responseBody.token.length, 'Expected token to be a non-empty string').toBeGreaterThan(0);

        console.log('✅ Successful login test passed. Token received:', responseBody.token);
    });

    test('POST - Invalid Login @master @regression @api', async ({ request }) => {
        const invalidCredentials = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${routes.AUTH_LOGIN}`, {
            data: invalidCredentials,
        });

        expect(response.status(), 'Expected status code to be 401 for invalid login').toBe(401);

        const responseText = await response.text();

        expect(
            responseText,
            'Expected error message to indicate invalid credentials'
        ).toContain('username or password is incorrect');

        console.log('✅ Invalid login test passed. Error message:', responseText);
    });
});
