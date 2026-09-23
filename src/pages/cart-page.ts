import { expect, type Page } from '@playwright/test';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export async function expectCartItems(page: Page, items: CartItem[]) {
  await expect(page.locator('tr[id^="product-"]')).toHaveCount(items.length);
  for (const item of items) {
    const row = page.locator(`#product-${item.id}`);
    await expect(row.locator('.cart_description h4')).toHaveText(item.name);
    await expect(row.locator('.cart_price')).toHaveText(`Rs. ${item.price}`);
    await expect(row.locator('.cart_quantity')).toHaveText(String(item.quantity));
    await expect(row.locator('.cart_total_price')).toHaveText(
      `Rs. ${item.price * item.quantity}`,
    );
  }
}

export function createCartPage(page: Page) {
  return {
    async open() {
      await page.locator('header').getByRole('link', { name: /Cart$/ }).click();
      await expect(page).toHaveURL(/\/view_cart\/?$/);
    },

    async expectItems(items: CartItem[]) {
      await expectCartItems(page, items);
    },

    async proceedToCheckout() {
      await page.getByText('Proceed To Checkout', { exact: true }).click();
    },

    async registerFromCheckout() {
      const modal = page.locator('#checkoutModal');
      await expect(modal).toBeVisible();
      await modal.getByRole('link', { name: 'Register / Login' }).click();
      await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible();
    },
  };
}
