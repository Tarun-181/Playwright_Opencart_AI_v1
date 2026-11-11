import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingAccountLogout: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingAccountLogout = page.getByRole('heading', { name: 'Account Logout' });
        this.btnContinue = page.getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies if the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the logout confirmation heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            await this.headingAccountLogout.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingAccountLogout.isVisible();
        } catch (error) {
            console.log(`Error checking Logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks Continue to return to the home page
     * @returns Promise<HomePage> - Instance of the HomePage
     */
    async clickContinue(): Promise<HomePage> {
        await this.btnContinue.click();
        return new HomePage(this.page);
    }
}
