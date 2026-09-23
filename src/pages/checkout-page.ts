import { expect, type Page } from '@playwright/test';
import type { UserData } from '../data/user';
import { expectCartItems, type CartItem } from './cart-page';

export function createCheckoutPage(page: Page) {
  return {
    async expectOrder(user: UserData, items: CartItem[]) {
      await expect(page).toHaveURL(/\/checkout\/?$/);
      await expect(page.getByRole('heading', { name: 'Address Details' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible();

      const checkoutInfo = page.getByTestId('checkout-info');

      for (const id of ['address_delivery', 'address_invoice']) {
        const address = checkoutInfo.locator(`#${id}`);
        const addressLines = address.locator('li').filter({
          hasNot: page.locator('h3'),
        });

        await expect(addressLines).toHaveText([
          `${user.title}. ${user.firstname} ${user.lastname}`,
          user.company,
          user.address1,
          user.address2,
          `${user.city} ${user.state} ${user.zipcode}`,
          user.country,
          user.mobile_number,
        ]);
      }

      await expectCartItems(page, items);
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalRow = page.getByRole('row').filter({ hasText: 'Total Amount' });
      await expect(totalRow.locator('.cart_total_price')).toHaveText(`Rs. ${total}`);
    },

    async placeOrder(comment: string) {
      await page.locator('[name="message"]').fill(comment);
      await page.getByRole('link', { name: 'Place Order', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toBeVisible();
    },
  };
}
