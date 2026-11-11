import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe('Products API Tests', () => {
  const BASE_URL = process.env.API_BASE_URL || 'https://fakestoreapi.com';
  const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
  const LIMIT = Number(process.env.LIMIT ?? 3);

  test('GET - All Products @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${routes.GET_ALL_PRODUCTS}`);
    expect(response.status(), 'Expected status 200 for GET all products').toBe(200);

    const body = await response.json();
    expect(Array.isArray(body), 'Response should be an array').toBe(true);
    expect(body.length, 'Products array should not be empty').toBeGreaterThan(0);

    const firstProduct = body[0];
    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('price');
    expect(firstProduct).toHaveProperty('category');
    expect(firstProduct).toHaveProperty('image');

    console.log(`✅ GET All Products passed — returned ${body.length} products`);
  });

  test('GET - Product by ID @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${routes.GET_PRODUCT_BY_ID(PRODUCT_ID)}`);
    expect(response.status(), 'Expected status 200 for GET product by ID').toBe(200);

    const body = await response.json();
    expect(body.id, `Expected product id to be ${PRODUCT_ID}`).toBe(PRODUCT_ID);
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('price');
    expect(body).toHaveProperty('category');
    expect(body).toHaveProperty('image');

    console.log(`✅ GET Product by ID passed — product id: ${body.id}, title: "${body.title}"`);
  });

  test('GET - Products with Limit @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${routes.GET_PRODUCTS_WITH_LIMIT(LIMIT)}`);
    expect(response.status(), 'Expected status 200 for GET products with limit').toBe(200);

    const body = await response.json();
    expect(Array.isArray(body), 'Response should be an array').toBe(true);
    expect(body.length, `Expected exactly ${LIMIT} products`).toBe(LIMIT);

    console.log(`✅ GET Products with Limit passed — returned ${body.length} products (limit=${LIMIT})`);
  });

  test('GET - Products Sorted Ascending @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${routes.GET_PRODUCTS_SORTED('asc')}`);
    expect(response.status(), 'Expected status 200 for GET products sorted ascending').toBe(200);

    const body = await response.json();
    const ids: number[] = body.map((product: { id: number }) => product.id);

    for (let i = 0; i < ids.length - 1; i++) {
      expect(ids[i], `Product id ${ids[i]} should be <= next id ${ids[i + 1]}`).toBeLessThanOrEqual(ids[i + 1]);
    }

    console.log(`✅ GET Products Sorted Ascending passed — ids are in ascending order`);
  });

  test('GET - Products Sorted Descending @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${routes.GET_PRODUCTS_SORTED('desc')}`);
    expect(response.status(), 'Expected status 200 for GET products sorted descending').toBe(200);

    const body = await response.json();
    const ids: number[] = body.map((product: { id: number }) => product.id);

    for (let i = 0; i < ids.length - 1; i++) {
      expect(ids[i], `Product id ${ids[i]} should be >= next id ${ids[i + 1]}`).toBeGreaterThanOrEqual(ids[i + 1]);
    }

    console.log(`✅ GET Products Sorted Descending passed — ids are in descending order`);
  });

  test('GET - All Product Categories @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${routes.GET_ALL_CATEGORIES}`);
    expect(response.status(), 'Expected status 200 for GET all categories').toBe(200);

    const body = await response.json();
    expect(Array.isArray(body), 'Response should be an array').toBe(true);
    expect(body.length, 'Categories array should not be empty').toBeGreaterThan(0);

    console.log(`✅ GET All Product Categories passed — categories: [${body.join(', ')}]`);
  });

  test('GET - Products by Category @master @sanity @api', async ({ request }) => {
    const category = 'electronics';
    const response = await request.get(`${BASE_URL}${routes.GET_PRODUCTS_BY_CATEGORY(category)}`);
    expect(response.status(), 'Expected status 200 for GET products by category').toBe(200);

    const body = await response.json();
    expect(Array.isArray(body), 'Response should be an array').toBe(true);

    for (const product of body) {
      expect(product.category, `Expected category to be "${category}" but got "${product.category}"`).toBe(category);
    }

    console.log(`✅ GET Products by Category passed — all ${body.length} products have category "${category}"`);
  });

  test('POST - Create Product @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateProductPayload();
    const response = await request.post(`${BASE_URL}${routes.CREATE_PRODUCT}`, {
      data: payload,
    });
    expect(response.status(), 'Expected status 201 for POST create product').toBe(201);

    const body = await response.json();
    expect(body.id, 'Created product should have a truthy id').toBeTruthy();
    expect(body.title, 'Response should contain the submitted title').toBe(payload.title);

    console.log(`✅ POST Create Product passed — created product id: ${body.id}, title: "${body.title}"`);
  });

  test('PUT - Update Product @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUpdatedProductPayload();
    const response = await request.put(`${BASE_URL}${routes.UPDATE_PRODUCT(PRODUCT_ID)}`, {
      data: payload,
    });
    expect(response.status(), 'Expected status 200 for PUT update product').toBe(200);

    const body = await response.json();
    expect(body.title, 'Response should contain the updated title').toBe(payload.title);
    expect(body.id, `Expected returned id to match ${PRODUCT_ID}`).toBe(PRODUCT_ID);

    console.log(`✅ PUT Update Product passed — updated product id: ${body.id}, title: "${body.title}"`);
  });

  test('DELETE - Delete Product @master @regression @api', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}${routes.DELETE_PRODUCT(PRODUCT_ID)}`);
    expect(response.status(), 'Expected status 200 for DELETE product').toBe(200);

    const body = await response.json();
    expect(body, 'Response body should exist').toBeTruthy();

    console.log(`✅ DELETE Product passed — deleted product id: ${PRODUCT_ID}`);
  });
});
