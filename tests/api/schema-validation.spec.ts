import { test, expect } from '@playwright/test';
import { routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import Ajv from 'ajv';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

test.describe('JSON Schema Validation Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    test('Schema Validation - Product Response @master @sanity @api', async ({ request }) => {
        // Send GET request to fetch a single product
        const response = await request.get(`${BASE_URL}${routes.GET_PRODUCT_BY_ID(PRODUCT_ID)}`);
        expect(response.status(), 'Expected status code 200 for GET product by ID').toBe(200);

        const responseBody = await response.json();

        // Load the product JSON schema
        const schema = DataProvider.readJson(path.resolve('./api/schemas/product_api_schema.json'));

        // Validate response against schema using AJV
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('❌ Product schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid, 'Product response should match the expected JSON schema').toBeTruthy();
        console.log('✅ Product response matches the expected JSON schema');
    });

    test('Schema Validation - User Response @master @sanity @api', async ({ request }) => {
        // Send GET request to fetch a single user
        const response = await request.get(`${BASE_URL}${routes.GET_USER_BY_ID(USER_ID)}`);
        expect(response.status(), 'Expected status code 200 for GET user by ID').toBe(200);

        const responseBody = await response.json();

        // Load the user JSON schema
        const schema = DataProvider.readJson(path.resolve('./api/schemas/user_api_schema.json'));

        // Validate response against schema using AJV
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('❌ User schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid, 'User response should match the expected JSON schema').toBeTruthy();
        console.log('✅ User response matches the expected JSON schema');
    });

    test('Schema Validation - Cart Response @master @sanity @api', async ({ request }) => {
        // Send GET request to fetch a single cart
        const response = await request.get(`${BASE_URL}${routes.GET_CART_BY_ID(CART_ID)}`);
        expect(response.status(), 'Expected status code 200 for GET cart by ID').toBe(200);

        const responseBody = await response.json();

        // Load the cart JSON schema
        const schema = DataProvider.readJson(path.resolve('./api/schemas/cart_api_schema.json'));

        // Validate response against schema using AJV
        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const isValid = validate(responseBody);

        if (!isValid) {
            console.log('❌ Cart schema validation errors:', JSON.stringify(validate.errors, null, 2));
        }

        expect(isValid, 'Cart response should match the expected JSON schema').toBeTruthy();
        console.log('✅ Cart response matches the expected JSON schema');
    });
});
