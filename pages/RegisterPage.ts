import { Page, Locator } from '@playwright/test';
import { AccountSuccessPage } from './AccountSuccessPage';

export interface UserRegistrationData {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
    passwordConfirm?: string;
    subscribeNewsletter?: boolean;
}

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly headingRegister: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtPasswordConfirm: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingRegister = page.getByRole('heading', { name: 'Register Account' });
        this.txtFirstName = page.locator('#input-firstname');
        this.txtLastName = page.locator('#input-lastname');
        this.txtEmail = page.locator('#input-email');
        this.txtTelephone = page.locator('#input-telephone');
        this.txtPassword = page.locator('#input-password');
        this.txtPasswordConfirm = page.locator('#input-confirm');
        this.chkPrivacyPolicy = page.locator('input[name="agree"]');
        this.btnContinue = page.locator('input[value="Continue"]');
    }

    /**
     * Verifies if the Register page is displayed
     * @returns Promise<boolean> - true if register heading is visible
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            await this.headingRegister.waitFor({ state: 'visible', timeout: 5000 });
            return await this.headingRegister.isVisible();
        } catch (error) {
            console.log(`Error checking Register page: ${error}`);
            return false;
        }
    }

    /**
     * Enters First Name
     * @param firstName - Customer first name
     * @returns Promise<void>
     */
    async setFirstName(firstName: string): Promise<void> {
        await this.txtFirstName.fill(firstName);
    }

    /**
     * Enters Last Name
     * @param lastName - Customer last name
     * @returns Promise<void>
     */
    async setLastName(lastName: string): Promise<void> {
        await this.txtLastName.fill(lastName);
    }

    /**
     * Enters Email address
     * @param email - Customer email address
     * @returns Promise<void>
     */
    async setEmail(email: string): Promise<void> {
        await this.txtEmail.fill(email);
    }

    /**
     * Enters Telephone number
     * @param telephone - Customer telephone number
     * @returns Promise<void>
     */
    async setTelephone(telephone: string): Promise<void> {
        await this.txtTelephone.fill(telephone);
    }

    /**
     * Enters Password
     * @param password - Account password
     * @returns Promise<void>
     */
    async setPassword(password: string): Promise<void> {
        await this.txtPassword.fill(password);
    }

    /**
     * Enters Password Confirmation
     * @param passwordConfirm - Account password confirmation
     * @returns Promise<void>
     */
    async setPasswordConfirm(passwordConfirm: string): Promise<void> {
        await this.txtPasswordConfirm.fill(passwordConfirm);
    }

    /**
     * Checks the Privacy Policy checkbox
     * @returns Promise<void>
     */
    async checkPrivacyPolicy(): Promise<void> {
        await this.chkPrivacyPolicy.check();
    }

    /**
     * Clicks the Continue button to submit registration
     * @returns Promise<AccountSuccessPage> - Instance of AccountSuccessPage
     */
    async clickContinue(): Promise<AccountSuccessPage> {
        await this.btnContinue.click();
        return new AccountSuccessPage(this.page);
    }

    /**
     * Completes registration with full user details
     * @param userData - Customer registration data
     * @returns Promise<AccountSuccessPage> - Instance of AccountSuccessPage
     */
    async completeRegistration(userData: UserRegistrationData): Promise<AccountSuccessPage> {
        try {
            await this.setFirstName(userData.firstName);
            await this.setLastName(userData.lastName);
            await this.setEmail(userData.email);
            await this.setTelephone(userData.telephone);
            await this.setPassword(userData.password);
            await this.setPasswordConfirm(userData.passwordConfirm ?? userData.password);
            await this.checkPrivacyPolicy();
            return await this.clickContinue();
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }
}
