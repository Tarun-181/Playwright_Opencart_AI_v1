import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly headingAccountCreated: Locator;
    private readonly txtConfirmationMessage: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingAccountCreated = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.txtConfirmationMessage = page.locator('#content p').first();
        this.btnContinue = page.getByRole('link', { name: 'Continue' });
    }

    /**
     * Verifies if the Account Success page is displayed
     * @returns Promise<boolean> - true if success heading is visible
     */
    async isAccountSuccessPageExists(): Promise<boolean> {
        try {
            await this.headingAccountCreated.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingAccountCreated.isVisible();
        } catch (error) {
            console.log(`Error checking Account Success page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the confirmation heading text
     * @returns Promise<string> - confirmation heading text
     */
    async getConfirmationHeading(): Promise<string> {
        return (await this.headingAccountCreated.textContent())?.trim() ?? '';
    }

    /**
     * Gets the confirmation paragraph text
     * @returns Promise<string> - confirmation message text
     */
    async getConfirmationMessage(): Promise<string> {
        return (await this.txtConfirmationMessage.textContent())?.trim() ?? '';
    }

    /**
     * Clicks the Continue button to navigate to My Account page
     * @returns Promise<MyAccountPage> - Instance of MyAccountPage
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.btnContinue.click();
        return new MyAccountPage(this.page);
    }
}
