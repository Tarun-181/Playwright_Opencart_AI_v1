import { Page, Locator } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProductTitle: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly alertSuccess: Locator;
    private readonly linkShoppingCart: Locator;
    private readonly linkCartInSuccessAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingProductTitle = page.locator('#content h1');
        this.txtQuantity = page.locator('#input-quantity');
        this.btnAddToCart = page.locator('#button-cart');
        this.alertSuccess = page.locator('.alert-success');
        this.linkShoppingCart = page.locator('a[title="Shopping Cart"]').first();
        this.linkCartInSuccessAlert = page.locator('.alert-success a[href*="route=checkout/cart"]');
    }

    /**
     * Verifies if the Product details page is displayed
     * @returns Promise<boolean> - true if product title is visible
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.headingProductTitle.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingProductTitle.isVisible();
        } catch (error) {
            console.log(`Error checking Product details page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the displayed product name/heading
     * @returns Promise<string> - Product name
     */
    async getProductName(): Promise<string> {
        return (await this.headingProductTitle.textContent())?.trim() ?? '';
    }

    /**
     * Sets the desired quantity in the quantity input field
     * @param quantity - Desired product quantity
     * @returns Promise<void>
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the Add to Cart button
     * @returns Promise<void>
     */
    async clickAddToCart(): Promise<void> {
        await this.btnAddToCart.click();
    }

    /**
     * Verifies whether the product-added success notification is displayed
     * @returns Promise<boolean> - true if success alert is visible
     */
    async isSuccessMessageVisible(): Promise<boolean> {
        try {
            await this.alertSuccess.waitFor({ state: 'visible', timeout: 5000 });
            return await this.alertSuccess.isVisible();
        } catch (error) {
            console.log(`Error checking success alert message: ${error}`);
            return false;
        }
    }

    /**
     * Gets the success notification message text
     * @returns Promise<string> - Text of the success alert
     */
    async getSuccessMessage(): Promise<string> {
        return (await this.alertSuccess.textContent())?.trim() ?? '';
    }

    /**
     * Navigates to the Shopping Cart page via the cart link
     * @returns Promise<CartPage> - Instance of CartPage
     */
    async navigateToCart(): Promise<CartPage> {
        try {
            if (await this.linkCartInSuccessAlert.isVisible()) {
                await this.linkCartInSuccessAlert.click();
            } else {
                await this.linkShoppingCart.click();
            }
            return new CartPage(this.page);
        } catch (error) {
            console.log(`Error navigating to Cart page: ${error}`);
            throw error;
        }
    }
}
