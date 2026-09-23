import { expect, type Page } from '@playwright/test';

export type PaymentDetails = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export function createPaymentPage(page: Page) {
  return {
    async pay(details: PaymentDetails) {
      await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toBeVisible();
      await page.getByTestId('name-on-card').fill(details.nameOnCard);
      await page.getByTestId('card-number').fill(details.cardNumber);
      await page.getByTestId('cvc').fill(details.cvc);
      await page.getByTestId('expiry-month').fill(details.expiryMonth);
      await page.getByTestId('expiry-year').fill(details.expiryYear);
      await page.getByTestId('pay-button').click();
    },

    async expectOrderPlaced() {
      await expect(page.getByTestId('order-placed')).toHaveText('Order Placed!');
      await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
    },
  };
}
