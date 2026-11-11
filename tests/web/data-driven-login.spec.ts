/**
 * Test Case: Login Flow (Data Driven using External File)
 *
 * Tags: @master @regression @datadriven @web
 *
 * Steps:
 * 1) Load test data rows from external data file (testdata/opencart_logindata.json)
 * 2) For each data row, navigate to My Account -> Login
 * 3) Enter email and password (or leave blank if empty) and submit
 * 4) If expected is "success", verify authentication and My Account page
 * 5) If expected is "failure", verify login failure, warning message, and non-authenticated state
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { DataProvider } from '../../utils/DataReader';

interface LoginDataRow {
    testName: string;
    email: string;
    password: string;
    expected: 'success' | 'failure';
}

const loginDataList: LoginDataRow[] = DataProvider.readJson('./testdata/opencart_logindata.json');

for (const row of loginDataList) {
    test(`Data-Driven Login: ${row.testName} @master @regression @datadriven @web`, async ({
        homePage,
        loginPage,
        myAccountPage,
    }) => {
        await test.step('1) Open application and navigate to My Account -> Login', async () => {
            expect(await homePage.isHomePageExists()).toBeTruthy();
            await homePage.clickMyAccount();
            await homePage.clickLogin();
            expect(await loginPage.isLoginPageExists()).toBeTruthy();
        });

        await test.step(`2) Enter credentials [email: "${row.email}"] and submit form`, async () => {
            if (row.email && row.email.trim() !== '') {
                await loginPage.setEmail(row.email);
            }
            if (row.password && row.password.trim() !== '') {
                await loginPage.setPassword(row.password);
            }
            await loginPage.clickLogin();
        });

        await test.step(`3) Validate login result based on expected: "${row.expected}"`, async () => {
            if (row.expected === 'success') {
                expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
                expect(await myAccountPage.isAccountNavigationVisible()).toBeTruthy();
                expect(await myAccountPage.isLogoutLinkVisible()).toBeTruthy();
            } else {
                expect(await loginPage.isLoginPageExists()).toBeTruthy();
                expect(await loginPage.isWarningMessageVisible()).toBeTruthy();
                const warningMsg = await loginPage.getWarningMessage();
                expect(warningMsg).toContain('Warning: No match for E-Mail Address and/or Password.');
                expect(await myAccountPage.isLogoutLinkVisible()).toBeFalsy();
            }
        });

        console.log(`✅ Data-Driven Login test "${row.testName}" completed successfully!`);
    });
}
