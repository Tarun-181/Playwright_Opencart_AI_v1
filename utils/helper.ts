export class Helper {
    static convertPriceToNumber(price: string): number {
        return Number(price.replace(/[^\d.]/g, ''));
    }

    static getProductDetails() {
        return {
            productName: process.env.PRODUCT_NAME || 'MacBook',
            productQuantity: process.env.PRODUCT_QUANTITY || '1',
            totalPrice: process.env.TOTAL_PRICE || '$602.00',
        };
    }

    static getLoginDetails() {
        const email = process.env.APP_EMAIL;
        const password = process.env.APP_PASSWORD;

        if (!email || !password) {
            throw new Error('APP_EMAIL and APP_PASSWORD must be configured for customer login tests.');
        }

        return {
            email,
            password,
        };
    }
}
