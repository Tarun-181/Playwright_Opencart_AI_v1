import { Page, Locator } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly headingShoppingCart: Locator;
    private readonly tableCart: Locator;
    private readonly cartRows: Locator;
    private readonly tableTotals: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingShoppingCart = page.locator('#content').getByRole('heading', { level: 1, name: /Shopping Cart/i });
        this.tableCart = page.locator('#content .table-responsive table');
        this.cartRows = page.locator('#content .table-responsive table tbody tr');
        this.tableTotals = page.locator('#content .row table.table-bordered');
    }

    /**
     * Verifies if the Shopping Cart page is displayed
     * @returns Promise<boolean> - true if shopping cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            await this.headingShoppingCart.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingShoppingCart.isVisible();
        } catch (error) {
            console.log(`Error checking Shopping Cart page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies whether the specified product is listed in the cart table
     * @param productName - Product name to find
     * @returns Promise<boolean> - true if product row is visible
     */
    async isProductInCart(productName: string): Promise<boolean> {
        try {
            const productRow = this.cartRows.filter({ has: this.page.locator('td.text-left a', { hasText: productName }) });
            await productRow.first().waitFor({ state: 'visible', timeout: 5000 });
            return await productRow.first().isVisible();
        } catch (error) {
            console.log(`Error checking product "${productName}" in cart: ${error}`);
            return false;
        }
    }

    /**
     * Gets the displayed quantity for the specified product in the cart
     * @param productName - Product name
     * @returns Promise<string> - Quantity string
     */
    async getProductQuantity(productName: string): Promise<string> {
        try {
            const productRow = this.cartRows.filter({ has: this.page.locator('td.text-left a', { hasText: productName }) }).first();
            const quantityInput = productRow.locator('input[name*="quantity"]');
            return (await quantityInput.getAttribute('value'))?.trim() ?? '';
        } catch (error) {
            console.log(`Error getting quantity for product "${productName}": ${error}`);
            return '';
        }
    }

    /**
     * Gets the unit price for the specified product in the cart
     * @param productName - Product name
     * @returns Promise<string> - Unit price string (e.g. "$602.00")
     */
    async getProductUnitPrice(productName: string): Promise<string> {
        try {
            const productRow = this.cartRows.filter({ has: this.page.locator('td.text-left a', { hasText: productName }) }).first();
            const unitPriceCell = productRow.locator('td.text-right').first();
            return (await unitPriceCell.textContent())?.trim() ?? '';
        } catch (error) {
            console.log(`Error getting unit price for product "${productName}": ${error}`);
            return '';
        }
    }

    /**
     * Gets the total price for the specified product row in the cart
     * @param productName - Product name
     * @returns Promise<string> - Row total price string (e.g. "$602.00")
     */
    async getProductTotalPrice(productName: string): Promise<string> {
        try {
            const productRow = this.cartRows.filter({ has: this.page.locator('td.text-left a', { hasText: productName }) }).first();
            const totalPriceCell = productRow.locator('td.text-right').last();
            return (await totalPriceCell.textContent())?.trim() ?? '';
        } catch (error) {
            console.log(`Error getting total price for product "${productName}": ${error}`);
            return '';
        }
    }

    /**
     * Gets the cart grand total displayed in the order summary table
     * @returns Promise<string> - Grand total string (e.g. "$602.00")
     */
    async getCartTotal(): Promise<string> {
        try {
            const totalRow = this.tableTotals.locator('tr').filter({ hasText: 'Total:' });
            const totalCell = totalRow.locator('td').last();
            return (await totalCell.textContent())?.trim() ?? '';
        } catch (error) {
            console.log(`Error getting cart total: ${error}`);
            return '';
        }
    }
}
