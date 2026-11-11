/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @sanity @regression @web @end-to-end
 *
 * Steps:
 * 1) Open the application and register a new customer using dynamically generated unique data
 * 2) Verify successful registration
 * 3) Log out and verify logout confirmation
 * 4) Log in again using the newly created credentials and verify successful authentication
 * 5) Search for a known product and open its details page
 * 6) Add the product to the cart and verify success notification
 * 7) Open shopping cart and verify product, quantity, unit price, and total amount
 * 8) Verify the complete customer journey finishes without errors
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-End Shopping Flow test @master @sanity @regression @web @end-to-end', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    myAccountPage,
    logoutPage,
    loginPage,
    searchResultsPage,
    productPage,
    cartPage,
}) => {
    test.setTimeout(60000);

    // Generate unique customer data
    const newCustomer = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: `e2e_${Date.now()}_${RandomDataUtil.getEmail()}`,
        telephone: '9876543210',
        password: 'TestPassword123!',
    };

    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Open application and navigate to Register page', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        expect(await registerPage.isRegisterPageExists()).toBeTruthy();
    });

    await test.step('2) Register new customer with dynamic unique data and verify success', async () => {
        await registerPage.setFirstName(newCustomer.firstName);
        await registerPage.setLastName(newCustomer.lastName);
        await registerPage.setEmail(newCustomer.email);
        await registerPage.setTelephone(newCustomer.telephone);
        await registerPage.setPassword(newCustomer.password);
        await registerPage.setPasswordConfirm(newCustomer.password);
        await registerPage.checkPrivacyPolicy();
        await registerPage.clickContinue();

        expect(await accountSuccessPage.isAccountSuccessPageExists()).toBeTruthy();
        expect(await accountSuccessPage.getConfirmationHeading()).toBe('Your Account Has Been Created!');
    });

    await test.step('3) Navigate to account and log out', async () => {
        await accountSuccessPage.clickContinue();
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        await myAccountPage.clickLogout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        await logoutPage.clickContinue();
        expect(await homePage.isHomePageExists()).toBeTruthy();
    });

    await test.step('4) Log in again with newly created credentials and verify authentication', async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        await loginPage.login(newCustomer.email, newCustomer.password);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await myAccountPage.isAccountNavigationVisible()).toBeTruthy();
    });

    await test.step('5) Search for a known product and navigate to product details', async () => {
        await homePage.search(productName);
        expect(await searchResultsPage.isSearchResultsPageExists()).toBeTruthy();
        expect(await searchResultsPage.isProductVisible(productName)).toBeTruthy();
        await searchResultsPage.selectProduct(productName);
        expect(await productPage.isProductPageExists()).toBeTruthy();
        expect(await productPage.getProductName()).toContain(productName);
    });

    await test.step('6) Add product to cart and verify confirmation message', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
        expect(await productPage.isSuccessMessageVisible()).toBeTruthy();
        const successText = await productPage.getSuccessMessage();
        expect(successText).toContain(`Success: You have added ${productName} to your shopping cart!`);
    });

    await test.step('7) Open cart and verify product, quantity, unit price, and total amount', async () => {
        await productPage.navigateToCart();
        expect(await cartPage.isCartPageExists()).toBeTruthy();
        expect(await cartPage.isProductInCart(productName)).toBeTruthy();
        expect(await cartPage.getProductQuantity(productName)).toBe(productQuantity);

        const unitPrice = await cartPage.getProductUnitPrice(productName);
        expect(unitPrice).toBeTruthy();

        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal).toBe(totalPrice);
    });

    console.log('✅ End-to-End Shopping Flow test completed successfully!');
});
