/**
 * Test Case: Product Search Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application and locate the main product search field
 * 2) Enter a valid known product name and submit the search
 * 3) Verify that the search results page is displayed
 * 4) Verify that the expected product appears in the results and matches search criteria
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Product Search Flow test @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
}) => {
    const { productName } = Helper.getProductDetails();

    await test.step('1) Open the application and locate the product search field', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        expect(await homePage.isSearchInputVisible()).toBeTruthy();
    });

    await test.step('2) Enter a valid known product name and submit the search', async () => {
        await homePage.search(productName);
    });

    await test.step('3) Verify that the search results page is displayed', async () => {
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
    });

    await test.step('4) Verify that the expected product appears in the results and matches search criteria', async () => {
        const isProductFound = await searchResultsPage.isProductVisible(productName);
        expect(isProductFound).toBeTruthy();

        const productNames = await searchResultsPage.getProductNames();
        const matchedProducts = productNames.filter(name => name.toLowerCase().includes(productName.toLowerCase()));
        expect(matchedProducts.length).toBeGreaterThan(0);
    });

    console.log('✅ Product Search Flow test completed successfully!');
});
