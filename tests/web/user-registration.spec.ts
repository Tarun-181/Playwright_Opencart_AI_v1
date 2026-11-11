/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the application and navigate to My Account -> Register
 * 2) Verify that the registration page is displayed
 * 3) Generate a unique customer email and enter valid values
 * 4) Accept the Privacy Policy and submit the registration form
 * 5) Verify that registration succeeds and the account-created confirmation is displayed
 * 6) Verify that the newly created account is available through the expected account navigation
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User Registration Flow test @master @sanity @regression @web', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    myAccountPage,
}) => {
    // Generate unique test data for registration
    const userData = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: `test_${Date.now()}_${RandomDataUtil.getEmail()}`,
        telephone: '1234567890',
        password: 'Password123!',
    };

    await test.step('1) Open the application and navigate to My Account -> Register', async () => {
        const isHomeLoaded = await homePage.isHomePageExists();
        expect(isHomeLoaded).toBeTruthy();
        await homePage.clickMyAccount();
        await homePage.clickRegister();
    });

    await test.step('2) Verify that the registration page is displayed', async () => {
        const isRegisterPageLoaded = await registerPage.isRegisterPageExists();
        expect(isRegisterPageLoaded).toBeTruthy();
    });

    await test.step('3) Enter valid registration details with unique customer email', async () => {
        await registerPage.setFirstName(userData.firstName);
        await registerPage.setLastName(userData.lastName);
        await registerPage.setEmail(userData.email);
        await registerPage.setTelephone(userData.telephone);
        await registerPage.setPassword(userData.password);
        await registerPage.setPasswordConfirm(userData.password);
    });

    await test.step('4) Accept Privacy Policy and submit registration form', async () => {
        await registerPage.checkPrivacyPolicy();
        await registerPage.clickContinue();
    });

    await test.step('5) Verify successful registration and confirmation message', async () => {
        const isSuccessPageLoaded = await accountSuccessPage.isAccountSuccessPageExists();
        expect(isSuccessPageLoaded).toBeTruthy();

        const confirmationHeading = await accountSuccessPage.getConfirmationHeading();
        expect(confirmationHeading).toBe('Your Account Has Been Created!');

        const confirmationMessage = await accountSuccessPage.getConfirmationMessage();
        expect(confirmationMessage).toContain('Congratulations! Your new account has been successfully created!');
    });

    await test.step('6) Verify newly created account is available through account navigation', async () => {
        await accountSuccessPage.clickContinue();
        const isMyAccountLoaded = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountLoaded).toBeTruthy();

        const isNavVisible = await myAccountPage.isAccountNavigationVisible();
        expect(isNavVisible).toBeTruthy();
    });

    console.log('✅ User Registration Flow test completed successfully!');
});
