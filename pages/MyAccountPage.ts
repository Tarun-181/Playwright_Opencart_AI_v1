import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;
    private readonly rightAccountNavigation: Locator;
    private readonly linkLogout: Locator;
    private readonly linkEditAccount: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingMyAccount = page.locator('#content').getByRole('heading', { name: 'My Account' });
        this.rightAccountNavigation = page.locator('#column-right .list-group');
        this.linkLogout = this.rightAccountNavigation.locator('a[href*="route=account/logout"]');
        this.linkEditAccount = page.locator('a[href*="route=account/edit"]').first();
    }

    /**
     * Verifies if the My Account page is displayed
     * @returns Promise<boolean> - true if My Account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.headingMyAccount.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies if the account navigation menu is visible
     * @returns Promise<boolean> - true if account navigation is visible
     */
    async isAccountNavigationVisible(): Promise<boolean> {
        try {
            return await this.rightAccountNavigation.isVisible();
        } catch (error) {
            console.log(`Error checking Account navigation: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Logout link
     * @returns Promise<void>
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.linkLogout.click();
        return new LogoutPage(this.page);
    }

    /**
     * Verifies whether the Logout option is visible for an authenticated customer
     * @returns Promise<boolean> - true if the Logout option is visible
     */
    async isLogoutLinkVisible(): Promise<boolean> {
        try {
            return await this.linkLogout.isVisible();
        } catch (error) {
            console.log(`Error checking Logout link visibility: ${error}`);
            return false;
        }
    }
}
