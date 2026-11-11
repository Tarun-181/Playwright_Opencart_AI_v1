import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly headingSearchResults: Locator;
    private readonly productThumbList: Locator;
    private readonly productTitles: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingSearchResults = page.locator('#content').getByRole('heading', { level: 1, name: /Search/i });
        this.productThumbList = page.locator('.product-layout .product-thumb');
        this.productTitles = page.locator('.product-thumb .caption h4 a');
    }

    /**
     * Verifies if the Search Results page is displayed
     * @returns Promise<boolean> - true if search heading is visible
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.headingSearchResults.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingSearchResults.isVisible();
        } catch (error) {
            console.log(`Error checking Search Results page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies whether a product with the specified name is visible in results
     * @param productName - Name of the product
     * @returns Promise<boolean> - true if product appears in results
     */
    async isProductVisible(productName: string): Promise<boolean> {
        try {
            const productLocator = this.productTitles.filter({ hasText: productName }).first();
            await productLocator.waitFor({ state: 'visible', timeout: 5000 });
            return await productLocator.isVisible();
        } catch (error) {
            console.log(`Error checking visibility of product "${productName}": ${error}`);
            return false;
        }
    }

    /**
     * Gets all product names displayed on the search results page
     * @returns Promise<string[]> - List of product names
     */
    async getProductNames(): Promise<string[]> {
        try {
            await this.productTitles.first().waitFor({ state: 'visible', timeout: 5000 });
            return await this.productTitles.allTextContents();
        } catch (error) {
            console.log(`Error getting product names: ${error}`);
            return [];
        }
    }

    /**
     * Clicks on the specified product name to navigate to its details page
     * @param productName - Name of the product to select
     * @returns Promise<ProductPage> - Instance of ProductPage
     */
    async selectProduct(productName: string): Promise<ProductPage> {
        try {
            const productLink = this.productTitles.filter({ hasText: productName }).first();
            await productLink.click();
            return new ProductPage(this.page);
        } catch (error) {
            console.log(`Error selecting product "${productName}": ${error}`);
            throw error;
        }
    }
}
