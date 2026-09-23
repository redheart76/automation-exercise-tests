import { expect, type Page } from '@playwright/test';
import { randomUUID } from 'node:crypto';

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
      await expect(
        page.getByRole('heading', { name: 'Payment', exact: true }),
      ).toBeVisible();
      await page.getByTestId('name-on-card').fill(details.nameOnCard);
      await page.getByTestId('card-number').fill(details.cardNumber);
      await page.getByTestId('cvc').fill(details.cvc);
      await page.getByTestId('expiry-month').fill(details.expiryMonth);
      await page.getByTestId('expiry-year').fill(details.expiryYear);

      // The submit handler reveals this message immediately before navigation.
      // Save the observation in the test process so navigation cannot erase it.
      let observedMessage: string | undefined;
      const bindingName = `paymentMessage_${randomUUID().replace(/-/g, '')}`;
      await page.exposeFunction(bindingName, (text: string) => {
        observedMessage = text;
      });
      await page.locator('#success_message').evaluate((element, binding) => {
        const observer = new MutationObserver(() => {
          const style = getComputedStyle(element);
          const bounds = element.getBoundingClientRect();
          if (
            style.display === 'none' ||
            style.visibility === 'hidden' ||
            style.visibility === 'collapse' ||
            bounds.width === 0 || bounds.height === 0
          ) return;

          const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
          observer.disconnect();
          const report = (window as unknown as Record<string, (value: string) => Promise<void>>)[binding];
          void report(text);
        });
        observer.observe(element, { attributes: true, childList: true, subtree: true });
        window.addEventListener('pagehide', () => observer.disconnect(), { once: true });
      }, bindingName);

      await page.getByTestId('pay-button').click();
      await expect.poll(
        () => observedMessage,
        { message: 'Payment submit should briefly display its success message' },
      ).toBe('Your order has been placed successfully!');
    },

    async expectOrderPlaced() {
      await expect(page.getByTestId('order-placed')).toHaveText(
        'Order Placed!',
      );
      await expect(
        page.getByText('Congratulations! Your order has been confirmed!', { exact: true }),
      ).toBeVisible();
    },
  };
}
