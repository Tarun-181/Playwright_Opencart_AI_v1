import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('Carts API Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    test('GET - All Carts @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_ALL_CARTS}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response should be an array').toBeTruthy();
        expect(body.length, 'Carts array should not be empty').toBeGreaterThan(0);

        console.log('✅ GET - All Carts passed. Total carts:', body.length);
    });

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_CART_BY_ID(CART_ID)}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(body.id, `Expected cart id to be ${CART_ID}`).toBe(CART_ID);

        console.log('✅ GET - Cart by ID passed. Cart ID:', body.id);
    });

    test('GET - Carts by Date Range @master @sanity @api', async ({ request }) => {
        const response = await request.get(
            `${BASE_URL}${routes.GET_CARTS_BY_DATE_RANGE(START_DATE, END_DATE)}`
        );

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response should be an array').toBeTruthy();

        const rangeStart = new Date(START_DATE).getTime();
        const rangeEnd = new Date(END_DATE).getTime();

        for (const cart of body) {
            expect(cart.date, 'Each cart should have a date field').toBeDefined();
            const cartDate = new Date(cart.date).getTime();
            expect(
                cartDate >= rangeStart && cartDate <= rangeEnd,
                `Cart date ${cart.date} should fall within range ${START_DATE} to ${END_DATE}`
            ).toBeTruthy();
        }

        console.log('✅ GET - Carts by Date Range passed. Carts in range:', body.length);
    });

    test('GET - User Cart @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_USER_CART(USER_ID)}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response should be an array').toBeTruthy();

        for (const cart of body) {
            expect(cart.userId, `Each cart userId should match ${USER_ID}`).toBe(USER_ID);
        }

        console.log('✅ GET - User Cart passed. Carts for user', USER_ID, ':', body.length);
    });

    test('GET - Carts with Limit @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_CARTS_WITH_LIMIT(LIMIT)}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response should be an array').toBeTruthy();
        expect(body.length, `Carts array length should be exactly ${LIMIT}`).toBe(LIMIT);

        console.log('✅ GET - Carts with Limit passed. Returned carts:', body.length);
    });

    test('GET - Carts Sorted Ascending @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_CARTS_SORTED('asc')}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response should be an array').toBeTruthy();

        const ids = body.map((cart: { id: number }) => cart.id);
        for (let i = 1; i < ids.length; i++) {
            expect(
                ids[i] >= ids[i - 1],
                `Cart IDs should be in ascending order but found ${ids[i - 1]} before ${ids[i]}`
            ).toBeTruthy();
        }

        console.log('✅ GET - Carts Sorted Ascending passed. IDs:', ids.join(', '));
    });

    test('GET - Carts Sorted Descending @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${routes.GET_CARTS_SORTED('desc')}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(Array.isArray(body), 'Response should be an array').toBeTruthy();

        const ids = body.map((cart: { id: number }) => cart.id);
        for (let i = 1; i < ids.length; i++) {
            expect(
                ids[i] <= ids[i - 1],
                `Cart IDs should be in descending order but found ${ids[i - 1]} before ${ids[i]}`
            ).toBeTruthy();
        }

        console.log('✅ GET - Carts Sorted Descending passed. IDs:', ids.join(', '));
    });

    test('POST - Create Cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${routes.CREATE_CART}`, {
            data: payload,
        });

        expect(response.status(), 'Expected status 201').toBe(201);

        const body = await response.json();
        expect(body.id, 'Response should contain an id').toBeDefined();
        expect(body.userId, `Response userId should match ${USER_ID}`).toBe(USER_ID);
        expect(body.products, 'Response should contain products array').toBeDefined();
        expect(Array.isArray(body.products), 'Products should be an array').toBeTruthy();

        console.log('✅ POST - Create Cart passed. New cart ID:', body.id);
    });

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

        const response = await request.put(`${BASE_URL}${routes.UPDATE_CART(CART_ID)}`, {
            data: payload,
        });

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(body.userId, `Response userId should match ${USER_ID}`).toBe(USER_ID);
        expect(body.products, 'Response should contain products array').toBeDefined();
        expect(Array.isArray(body.products), 'Products should be an array').toBeTruthy();

        console.log('✅ PUT - Update Cart passed. Updated cart ID:', body.id);
    });

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}${routes.DELETE_CART(CART_ID)}`);

        expect(response.status(), 'Expected status 200').toBe(200);

        const body = await response.json();
        expect(body, 'Response body should not be null or undefined').toBeDefined();
        expect(body.id, `Deleted cart id should match ${CART_ID}`).toBe(CART_ID);

        console.log('✅ DELETE - Delete Cart passed. Deleted cart ID:', body.id);
    });
});
