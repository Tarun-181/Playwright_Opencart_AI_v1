import { Locator, Page } from '@playwright/test';

export interface AdminCustomerDetails {
    firstName: string;
    lastName: string;
    email: string;
    status: string;
}

export class AdminCustomersPage {
    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly securityModal: Locator;
    private readonly securityModalCloseButton: Locator;
    private readonly customerMenu: Locator;
    private readonly customersLink: Locator;
    private readonly emailFilter: Locator;
    private readonly filterButton: Locator;
    private readonly customerTable: Locator;
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly customerEmailInput: Locator;
    private readonly statusSelect: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.locator('#input-username');
        this.passwordInput = page.locator('#input-password');
        this.loginButton = page.locator('button[type="submit"]');
        this.securityModal = page.locator('#modal-security');
        this.securityModalCloseButton = page.locator('#modal-security button.close');
        this.customerMenu = page.locator('#menu-customer > a');
        this.customersLink = page
            .locator('#menu-customer a[href*="route=customer/customer"]')
            .filter({ hasText: /^Customers$/ });
        this.emailFilter = page.locator('#input-email');
        this.filterButton = page.locator('#button-filter');
        this.customerTable = page.locator('#form-customer table');
        this.firstNameInput = page.locator('#input-firstname');
        this.lastNameInput = page.locator('#input-lastname');
        this.customerEmailInput = page.locator('#input-email');
        this.statusSelect = page.locator('#input-status');
    }

    /**
     * Opens the configured OpenCart administrator URL.
     * @param adminUrl - Administrator login URL
     * @returns Promise<void>
     */
    async open(adminUrl: string): Promise<void> {
        await this.page.goto(adminUrl);
    }

    /**
     * Signs in to the administrator portal.
     * @param username - Configured administrator username
     * @param password - Configured administrator password
     * @returns Promise<void>
     */
    async login(username: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.customerMenu.waitFor({ state: 'visible' });
        await this.dismissSecurityNotificationIfPresent();
    }

    /**
     * Dismisses the OpenCart security notification modal when displayed after login.
     * @returns Promise<void>
     */
    private async dismissSecurityNotificationIfPresent(): Promise<void> {
        try {
            await this.securityModalCloseButton.waitFor({ state: 'visible', timeout: 2000 });
            await this.securityModalCloseButton.click();
            await this.securityModal.waitFor({ state: 'hidden' });
        } catch {
            // Security modal is only shown when the storage directory is still inside the web root.
        }
    }

    /**
     * Navigates to the Customers list from the administrator menu.
     * @returns Promise<void>
     */
    async navigateToCustomers(): Promise<void> {
        await this.customerMenu.click();
        await this.customersLink.click();
    }

    /**
     * Filters the customer list by an exact email address.
     * @param email - Customer email address
     * @returns Promise<Locator> - Matching customer table row
     */
    async searchCustomerByEmail(email: string): Promise<Locator> {
        await this.emailFilter.fill(email);
        await this.filterButton.click();
        return this.customerTable.locator('tbody tr').filter({ hasText: email });
    }

    /**
     * Opens the edit form for a matching customer row.
     * @param customerRow - Matching customer table row
     * @returns Promise<void>
     */
    async openCustomerRecord(customerRow: Locator): Promise<void> {
        await customerRow.locator('a[href*="route=customer/customer/edit"]').click();
    }

    /**
     * Reads the customer fields and selected status from the edit form.
     * @returns Promise<AdminCustomerDetails> - Customer details shown in the portal
     */
    async getCustomerDetails(): Promise<AdminCustomerDetails> {
        return {
            firstName: await this.firstNameInput.inputValue(),
            lastName: await this.lastNameInput.inputValue(),
            email: await this.customerEmailInput.inputValue(),
            status: (await this.statusSelect.locator('option:checked').textContent())?.trim() ?? '',
        };
    }
}
