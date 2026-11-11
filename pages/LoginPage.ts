import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly headingReturningCustomer: Locator;
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;
    private readonly alertWarning: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingReturningCustomer = page.getByRole('heading', { name: 'Returning Customer' });
        this.txtEmail = page.locator('#input-email');
        this.txtPassword = page.locator('#input-password');
        this.btnLogin = page.locator('input[value="Login"]');
        this.alertWarning = page.locator('.alert-danger');
    }

    /**
     * Verifies if the Login page is displayed
     * @returns Promise<boolean> - true if the returning customer section is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            await this.headingReturningCustomer.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingReturningCustomer.isVisible();
        } catch (error) {
            console.log(`Error checking Login page: ${error}`);
            return false;
        }
    }

    /**
     * Enters the customer email address
     * @param email - Customer email address
     * @returns Promise<void>
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters the customer password
     * @param password - Customer password
     * @returns Promise<void>
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Submits the login form
     * @returns Promise<MyAccountPage> - Instance of the MyAccountPage
     */
    async clickLogin(): Promise<MyAccountPage> {
        await this.btnLogin.click();
        return new MyAccountPage(this.page);
    }

    /**
     * Completes the login form and submits it
     * @param email - Customer email address
     * @param password - Customer password
     * @returns Promise<MyAccountPage> - Instance of the MyAccountPage
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        try {
            await this.setEmail(email);
            await this.setPassword(password);
            return await this.clickLogin();
        } catch (error) {
            console.log(`Error completing login: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies whether the login warning is visible
     * @returns Promise<boolean> - true if the login warning is visible
     */
    async isWarningMessageVisible(): Promise<boolean> {
        try {
            return await this.alertWarning.isVisible();
        } catch (error) {
            console.log(`Error checking login warning: ${error}`);
            return false;
        }
    }

    /**
     * Gets the login warning text
     * @returns Promise<string> - warning text
     */
    async getWarningMessage(): Promise<string> {
        return (await this.alertWarning.textContent())?.trim() ?? '';
    }
}
