import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';
import type { RowDataPacket } from 'mysql2/promise';

const expectedCustomerStatus = {
    databaseValue: 1,
    adminLabel: 'Enabled',
};

function requiredEnvironmentValue(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

test('Register and verify a customer across OpenCart UI, Admin, and MySQL @master @sanity @regression @web @end-to-end @db', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    adminCustomersPage,
}) => {
    test.setTimeout(90_000);

    const customer = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: `db_${Date.now()}_${RandomDataUtil.getEmail()}`,
        telephone: '1234567890',
        password: RandomDataUtil.getPassword(16),
    };
    let registrationSubmitted = false;
    let primaryError: unknown;

    try {
        await test.step('Register the dynamically generated customer through the frontend', async () => {
            expect(await homePage.isHomePageExists()).toBeTruthy();
            await homePage.clickMyAccount();
            await homePage.clickRegister();
            expect(await registerPage.isRegisterPageExists()).toBeTruthy();

            await registerPage.setFirstName(customer.firstName);
            await registerPage.setLastName(customer.lastName);
            await registerPage.setEmail(customer.email);
            await registerPage.setTelephone(customer.telephone);
            await registerPage.setPassword(customer.password);
            await registerPage.setPasswordConfirm(customer.password);
            await registerPage.checkPrivacyPolicy();
            registrationSubmitted = true;
            await registerPage.clickContinue();

            expect(await accountSuccessPage.isAccountSuccessPageExists()).toBeTruthy();
            expect(await accountSuccessPage.getConfirmationHeading()).toBe('Your Account Has Been Created!');
        });

        await test.step('Verify the new customer in the OpenCart Admin Portal', async () => {
            const webAppUrl = requiredEnvironmentValue('WEB_APP_URL');
            const adminUrl = new URL('admin/index.php', webAppUrl).toString();
            await adminCustomersPage.open(adminUrl);
            await adminCustomersPage.login(
                requiredEnvironmentValue('ADMIN_USERNAME'),
                requiredEnvironmentValue('ADMIN_PASSWORD'),
            );
            await adminCustomersPage.navigateToCustomers();

            const customerRow = await adminCustomersPage.searchCustomerByEmail(customer.email);
            await expect(customerRow, `Expected one admin customer row for ${customer.email}`).toHaveCount(1);
            await adminCustomersPage.openCustomerRecord(customerRow);

            const adminCustomer = await adminCustomersPage.getCustomerDetails();
            expect(adminCustomer.firstName, 'Admin first name should match the registered customer').toBe(customer.firstName);
            expect(adminCustomer.lastName, 'Admin last name should match the registered customer').toBe(customer.lastName);
            expect(adminCustomer.email, 'Admin email should match the registered customer').toBe(customer.email);
            expect(adminCustomer.status, 'A newly registered customer should be enabled in the admin portal').toBe(expectedCustomerStatus.adminLabel);
        });

        await test.step('Verify the new customer record in MySQL', async () => {
            const [columnRows] = await executeQuery('SHOW COLUMNS FROM oc_customer');
            const hasDateAdded = (columnRows as RowDataPacket[]).some((column) => column.Field === 'date_added');
            const dateAddedColumn = hasDateAdded ? ', date_added' : '';
            const [resultRows] = await executeQuery(
                `SELECT firstname, lastname, email, status${dateAddedColumn} FROM oc_customer WHERE email = ?`,
                [customer.email],
            );
            const customerRows = resultRows as RowDataPacket[];

            expect(customerRows, `Expected exactly one database customer for ${customer.email}`).toHaveLength(1);
            const databaseCustomer = customerRows[0];
            expect(databaseCustomer, `Expected a database record for ${customer.email}`).toBeDefined();
            if (!databaseCustomer) {
                throw new Error(`Database customer row was missing for ${customer.email}`);
            }

            expect(databaseCustomer.firstname, 'Database first name should match the registered customer').toBe(customer.firstName);
            expect(databaseCustomer.lastname, 'Database last name should match the registered customer').toBe(customer.lastName);
            expect(databaseCustomer.email, 'Database email should match the registered customer').toBe(customer.email);
            expect(Number(databaseCustomer.status), 'Database status should indicate an enabled customer').toBe(expectedCustomerStatus.databaseValue);
            if (hasDateAdded) {
                expect(databaseCustomer.date_added, 'Database date_added should be populated when the column exists').toBeTruthy();
            }
        });
    } catch (error) {
        primaryError = error;
        throw error;
    } finally {
        if (registrationSubmitted) {
            await test.step('Remove the generated customer record', async () => {
                try {
                    await executeQuery('DELETE FROM oc_customer WHERE email = ?', [customer.email]);
                } catch (cleanupError) {
                    if (primaryError) {
                        console.warn('Database cleanup failed after test failure:', cleanupError);
                        return;
                    }
                    throw cleanupError;
                }
            });
        }
    }
});
