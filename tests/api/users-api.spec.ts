import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('Users API Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    test('GET - All Users @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_ALL_USERS}`);
        expect(response.status(), 'Expected status 200 for GET all users').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, 'Users array should not be empty').toBeGreaterThan(0);

        console.log(`✅ GET All Users passed — returned ${body.length} users`);
    });

    test('GET - User by ID @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_USER_BY_ID(USER_ID)}`);
        expect(response.status(), 'Expected status 200 for GET user by ID').toBe(200);

        const body = await response.json();
        expect(body.id, `Expected user id to be ${USER_ID}`).toBe(USER_ID);

        console.log(`✅ GET User by ID passed — user id: ${body.id}, username: ${body.username}`);
    });

    test('GET - Users with Limit @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_USERS_WITH_LIMIT(LIMIT)}`);
        expect(response.status(), 'Expected status 200 for GET users with limit').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();
        expect(body.length, `Expected exactly ${LIMIT} users`).toBe(LIMIT);

        console.log(`✅ GET Users with Limit passed — returned ${body.length} users (limit: ${LIMIT})`);
    });

    test('GET - Users Sorted Ascending @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_USERS_SORTED('asc')}`);
        expect(response.status(), 'Expected status 200 for GET users sorted ascending').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();

        const ids: number[] = body.map((user: { id: number }) => user.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i], `Expected id ${ids[i]} to be >= ${ids[i - 1]} for ascending order`).toBeGreaterThanOrEqual(ids[i - 1]);
        }

        console.log(`✅ GET Users Sorted Ascending passed — IDs in ascending order: [${ids.join(', ')}]`);
    });

    test('GET - Users Sorted Descending @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_USERS_SORTED('desc')}`);
        expect(response.status(), 'Expected status 200 for GET users sorted descending').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response body should be an array').toBeTruthy();

        const ids: number[] = body.map((user: { id: number }) => user.id);
        for (let i = 1; i < ids.length; i++) {
            expect(ids[i], `Expected id ${ids[i]} to be <= ${ids[i - 1]} for descending order`).toBeLessThanOrEqual(ids[i - 1]);
        }

        console.log(`✅ GET Users Sorted Descending passed — IDs in descending order: [${ids.join(', ')}]`);
    });

    test('POST - Create User @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserPayload();
        const response = await request.post(`${BASE_URL}${routes.CREATE_USER}`, {
            data: payload,
        });
        expect(response.status(), 'Expected status 201 for POST create user').toBe(201);

        const body = await response.json();
        expect(body.id, 'Response should contain an id for the created user').toBeDefined();

        console.log(`✅ POST Create User passed — new user id: ${body.id}, username: ${payload.username}`);
    });

    test('PUT - Update User @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserUpdatePayload();
        const response = await request.put(`${BASE_URL}${routes.UPDATE_USER(USER_ID)}`, {
            data: payload,
        });
        expect(response.status(), 'Expected status 200 for PUT update user').toBe(200);

        const body = await response.json();
        expect(body.email, 'Updated email should match payload').toBe(payload.email);
        expect(body.username, 'Updated username should match payload').toBe(payload.username);
        expect(body.name?.firstname, 'Updated firstname should match payload').toBe(payload.name.firstname);
        expect(body.name?.lastname, 'Updated lastname should match payload').toBe(payload.name.lastname);
        expect(body.phone, 'Updated phone should match payload').toBe(payload.phone);

        console.log(`✅ PUT Update User passed — updated user id: ${USER_ID}, username: ${body.username}`);
    });

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}${routes.DELETE_USER(USER_ID)}`);
        expect(response.status(), 'Expected status 200 for DELETE user').toBe(200);

        const body = await response.json();
        expect(body, 'Response body should not be null or undefined').toBeDefined();
        expect(body.id, 'Deleted user response should contain an id').toBeDefined();

        console.log(`✅ DELETE User passed — deleted user id: ${body.id}`);
    });
});
