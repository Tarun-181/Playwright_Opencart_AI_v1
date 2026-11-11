/**
 * Test Cases: Valid Login Flow, Invalid Login Flow, and Logout Flow
 *
 * Tags: @master @sanity @regression @web
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('Valid Login Flow test @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application and navigate to My Account -> Login', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Verify that the login page is displayed', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
    });

    await test.step('3) Enter valid configured customer credentials and submit the login form', async () => {
        await loginPage.login(email, password);
    });

    await test.step('4) Verify successful authentication and the My Account dashboard', async () => {
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await myAccountPage.isAccountNavigationVisible()).toBeTruthy();
        expect(await myAccountPage.isLogoutLinkVisible()).toBeTruthy();
    });

    console.log('✅ Valid Login Flow test completed successfully!');
});

test('Invalid Login Flow test @master @sanity @regression @web', async ({ homePage, loginPage, myAccountPage }) => {
    const invalidCredentials = {
        email: `invalid_${Date.now()}_${RandomDataUtil.getEmail()}`,
        password: RandomDataUtil.getPassword(),
    };

    await test.step('1) Open the application and navigate to My Account -> Login', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        await homePage.clickLogin();
    });

    await test.step('2) Enter invalid customer credentials and submit the login form', async () => {
        await loginPage.login(invalidCredentials.email, invalidCredentials.password);
    });

    await test.step('3) Verify authentication fails with the expected warning', async () => {
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        expect(await loginPage.isWarningMessageVisible()).toBeTruthy();
        expect(await loginPage.getWarningMessage()).toContain('Warning: No match for E-Mail Address and/or Password.');
    });

    await test.step('4) Verify that the customer is not authenticated', async () => {
        expect(await myAccountPage.isLogoutLinkVisible()).toBeFalsy();
    });

    console.log('✅ Invalid Login Flow test completed successfully!');
});

test('Logout Flow test @master @sanity @regression @web', async ({
    homePage,
    loginPage,
    myAccountPage,
    logoutPage,
}) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the application, log in, and verify authentication succeeds', async () => {
        expect(await homePage.isHomePageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
        expect(await myAccountPage.isLogoutLinkVisible()).toBeTruthy();
    });

    await test.step('2) Navigate to the account logout option and click Logout', async () => {
        await myAccountPage.clickLogout();
    });

    await test.step('3) Verify the logout confirmation page is displayed', async () => {
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
    });

    await test.step('4) Continue to the home page and verify authenticated options are unavailable', async () => {
        await logoutPage.clickContinue();
        expect(await homePage.isHomePageExists()).toBeTruthy();
        await homePage.clickMyAccount();
        expect(await homePage.isLoginLinkVisible()).toBeTruthy();
        expect(await myAccountPage.isLogoutLinkVisible()).toBeFalsy();
    });

    console.log('✅ Logout Flow test completed successfully!');
});
