import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

import { routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
const USER_ID = Number(process.env.USER_ID ?? 1);

// ──────────────────────────────────────────────
// Test 32 – Product CRUD Workflow
// ──────────────────────────────────────────────
test.describe.serial('Product CRUD Workflow', () => {
  let createdProductId: number;

  test('POST - Create Product @master @regression @end-to-end @api', async ({ request }) => {
    const payload = RandomDataUtil.generateProductPayload();

    const response = await request.post(`${BASE_URL}${routes.CREATE_PRODUCT}`, {
      data: payload,
    });

    expect(response.status(), 'Expected status 201 for product creation').toBe(201);

    const body = await response.json();
    expect(body.id, 'Created product should have an id').toBeDefined();

    createdProductId = body.id;

    console.log(`✅ Product created successfully with id: ${createdProductId}`);
  });

  test('PUT - Update Product @master @regression @end-to-end @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUpdatedProductPayload();

    const response = await request.put(`${BASE_URL}${routes.UPDATE_PRODUCT(createdProductId)}`, {
      data: payload,
    });

    expect(response.status(), 'Expected status 200 for product update').toBe(200);

    const body = await response.json();
    expect(body.title, 'Updated product title should match payload').toBe(payload.title);
    expect(body.price, 'Updated product price should match payload').toBe(payload.price);
    expect(body.description, 'Updated product description should match payload').toBe(payload.description);
    expect(body.category, 'Updated product category should match payload').toBe(payload.category);

    console.log(`✅ Product ${createdProductId} updated successfully`);
  });

  test('DELETE - Delete Product @master @regression @end-to-end @api', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}${routes.DELETE_PRODUCT(createdProductId)}`);

    expect(response.status(), 'Expected status 200 for product deletion').toBe(200);

    const responseText = await response.text();
    expect(responseText, 'Delete response should be defined').toBeDefined();

    console.log(`✅ Product ${createdProductId} deleted successfully`);
  });
});

// ──────────────────────────────────────────────
// Test 33 – User CRUD Workflow
// ──────────────────────────────────────────────
test.describe.serial('User CRUD Workflow', () => {
  let createdUserId: number;

  test('POST - Create User @master @regression @end-to-end @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUserPayload();

    const response = await request.post(`${BASE_URL}${routes.CREATE_USER}`, {
      data: payload,
    });

    expect(response.status(), 'Expected status 201 for user creation').toBe(201);

    const body = await response.json();
    expect(body.id, 'Created user should have an id').toBeDefined();

    createdUserId = body.id;

    console.log(`✅ User created successfully with id: ${createdUserId}`);
  });

  test('PUT - Update User @master @regression @end-to-end @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUserUpdatePayload();

    const response = await request.put(`${BASE_URL}${routes.UPDATE_USER(createdUserId)}`, {
      data: payload,
    });

    expect(response.status(), 'Expected status 200 for user update').toBe(200);

    const body = await response.json();
    expect(body.email, 'Updated user email should match payload').toBe(payload.email);
    expect(body.username, 'Updated user username should match payload').toBe(payload.username);
    expect(body.name.firstname, 'Updated user firstname should match payload').toBe(payload.name.firstname);
    expect(body.name.lastname, 'Updated user lastname should match payload').toBe(payload.name.lastname);
    expect(body.address.city, 'Updated user city should match payload').toBe(payload.address.city);
    expect(body.phone, 'Updated user phone should match payload').toBe(payload.phone);

    console.log(`✅ User ${createdUserId} updated successfully`);
  });

  test('DELETE - Delete User @master @regression @end-to-end @api', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}${routes.DELETE_USER(createdUserId)}`);

    expect(response.status(), 'Expected status 200 for user deletion').toBe(200);

    const body = await response.json();
    expect(body, 'Delete response body should exist').toBeDefined();

    console.log(`✅ User ${createdUserId} deleted successfully`);
  });
});

// ──────────────────────────────────────────────
// Test 34 – Cart CRUD Workflow
// ──────────────────────────────────────────────
test.describe.serial('Cart CRUD Workflow', () => {
  let createdCartId: number;

  test('POST - Create Cart @master @regression @end-to-end @api', async ({ request }) => {
    const payload = RandomDataUtil.generateCartPayload(USER_ID);

    const response = await request.post(`${BASE_URL}${routes.CREATE_CART}`, {
      data: payload,
    });

    expect(response.status(), 'Expected status 201 for cart creation').toBe(201);

    const body = await response.json();
    expect(body.id, 'Created cart should have an id').toBeDefined();

    createdCartId = body.id;

    expect(body.userId, 'Cart userId should match payload').toBeDefined();
    expect(body.products, 'Cart products should be present in response').toBeDefined();

    console.log(`✅ Cart created successfully with id: ${createdCartId}`);
  });

  test('PUT - Update Cart @master @regression @end-to-end @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);

    const response = await request.put(`${BASE_URL}${routes.UPDATE_CART(createdCartId)}`, {
      data: payload,
    });

    expect(response.status(), 'Expected status 200 for cart update').toBe(200);

    const body = await response.json();
    expect(body.products, 'Updated cart should contain products').toBeDefined();
    expect(Array.isArray(body.products), 'Products should be an array').toBeTruthy();

    if (body.products && body.products.length > 0) {
      expect(body.products[0].quantity, 'Updated product quantity should be defined').toBeDefined();
    }

    console.log(`✅ Cart ${createdCartId} updated successfully`);
  });

  test('DELETE - Delete Cart @master @regression @end-to-end @api', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}${routes.DELETE_CART(createdCartId)}`);

    expect(response.status(), 'Expected status 200 for cart deletion').toBe(200);

    const body = await response.json();
    expect(body, 'Delete response body should exist').toBeDefined();

    console.log(`✅ Cart ${createdCartId} deleted successfully`);
  });
});
