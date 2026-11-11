import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { MyAccountPage } from './MyAccountPage';
import { LoginPage } from './LoginPage';
import { SearchResultsPage } from './SearchResultsPage';
import { CartPage } from './CartPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly linkMyAccount: Locator;
    private readonly linkRegister: Locator;
    private readonly linkLogin: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;
    private readonly linkShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.linkMyAccount = page.locator('a[title="My Account"]');
        this.linkRegister = page.locator('a[href*="route=account/register"]');
        this.linkLogin = page.locator('a[href*="route=account/login"]');
        this.txtSearch = page.locator('#search input[name="search"]');
        this.btnSearch = page.locator('#search button');
        this.linkShoppingCart = page.locator('a[title="Shopping Cart"]').first();
    }

    /**
     * Clicks the My Account dropdown menu
     * @returns Promise<void>
     */
    async clickMyAccount(): Promise<void> {
        await this.linkMyAccount.click();
    }

    /**
     * Clicks the Register link in the My Account dropdown
     * @returns Promise<RegisterPage> - Instance of the RegisterPage
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.linkRegister.click();
        return new RegisterPage(this.page);
    }

    /**
     * Clicks the Login link in the My Account dropdown
     * @returns Promise<LoginPage> - Instance of the LoginPage
     */
    async clickLogin(): Promise<LoginPage> {
        await this.linkLogin.click();
        return new LoginPage(this.page);
    }

    /**
     * Verifies whether the Login option is visible in the My Account dropdown
     * @returns Promise<boolean> - true if the Login option is visible
     */
    async isLoginLinkVisible(): Promise<boolean> {
        try {
            return await this.linkLogin.isVisible();
        } catch (error) {
            console.log(`Error checking Login link visibility: ${error}`);
            return false;
        }
    }

    /**
     * Navigates to the Register page via My Account menu
     * @returns Promise<RegisterPage> - Instance of the RegisterPage
     */
    async navigateToRegisterPage(): Promise<RegisterPage> {
        try {
            await this.clickMyAccount();
            return await this.clickRegister();
        } catch (error) {
            console.log(`Error navigating to Register page: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies if the Home page is displayed
     * @returns Promise<boolean> - true if home page element is visible
     */
    async isHomePageExists(): Promise<boolean> {
        try {
            await this.linkMyAccount.waitFor({ state: 'visible', timeout: 5000 });
            return await this.linkMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking Home page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies if the search input field is visible
     * @returns Promise<boolean> - true if search input is visible
     */
    async isSearchInputVisible(): Promise<boolean> {
        try {
            await this.txtSearch.waitFor({ state: 'visible', timeout: 5000 });
            return await this.txtSearch.isVisible();
        } catch (error) {
            console.log(`Error checking Search input visibility: ${error}`);
            return false;
        }
    }

    /**
     * Enters product search text in the search input
     * @param productName - Product name or search keyword
     * @returns Promise<void>
     */
    async setSearchText(productName: string): Promise<void> {
        await this.txtSearch.fill(productName);
    }

    /**
     * Clicks the search button
     * @returns Promise<SearchResultsPage> - Instance of SearchResultsPage
     */
    async clickSearch(): Promise<SearchResultsPage> {
        await this.btnSearch.click();
        return new SearchResultsPage(this.page);
    }

    /**
     * Performs a full search action with the given product name
     * @param productName - Name of the product to search for
     * @returns Promise<SearchResultsPage> - Instance of SearchResultsPage
     */
    async search(productName: string): Promise<SearchResultsPage> {
        try {
            await this.setSearchText(productName);
            return await this.clickSearch();
        } catch (error) {
            console.log(`Error performing search: ${error}`);
            throw error;
        }
    }

    /**
     * Clicks the shopping cart link in the header
     * @returns Promise<CartPage> - Instance of CartPage
     */
    async clickShoppingCart(): Promise<CartPage> {
        await this.linkShoppingCart.click();
        return new CartPage(this.page);
    }
}
