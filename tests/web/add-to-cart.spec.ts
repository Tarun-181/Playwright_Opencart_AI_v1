/**
 * Test Case: Add Product to Cart Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application and search for a valid known product
 * 2) Open the product details page and verify product details are displayed
 * 3) Set the required quantity and click Add to Cart
 * 4) Verify the product-added success/confirmation message
 * 5) Open the shopping cart and verify product presence and quantity
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Add Product to Cart Flow test @master @sanity @regression @web', async ({
    homePage,
    searchResultsPage,
    productPage,
    cartPage,
}) => {
    const { productName, productQuantity } = Helper.getProductDetails();

    await test.step('1) Open the application and search for a valid known product', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        await homePage.search(productName);
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
        expect(await searchResultsPage.isProductVisible(productName)).toBeTruthy();
    });

    await test.step('2) Open the product details page and verify product details are displayed', async () => {
        await searchResultsPage.selectProduct(productName);
        expect(await productPage.isProductPageExists()).toBeTruthy();
        expect(await productPage.getProductName()).toContain(productName);
    });

    await test.step('3) Set required quantity and click Add to Cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
    });

    await test.step('4) Verify the product-added success/confirmation message', async () => {
        expect(await productPage.isSuccessMessageVisible()).toBeTruthy();
        const successMessage = await productPage.getSuccessMessage();
        expect(successMessage).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('5) Open the shopping cart and verify product presence and quantity', async () => {
        await productPage.navigateToCart();
        expect(await cartPage.isCartPageExists()).toBeTruthy();
        expect(await cartPage.isProductInCart(productName)).toBeTruthy();
        expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);
    });

    console.log('✅ Add Product to Cart Flow test completed successfully!');
});
