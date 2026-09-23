import { expect, type Page } from '@playwright/test';
import type { CartItem } from './cart-page';

export function createProductPage(page: Page, baseUrl: string) {
  return {
    async open() {
      await page.goto(new URL('/products', baseUrl).href, {
        waitUntil: 'domcontentloaded',
      });
      await expect(page).toHaveURL(/\/products\/?$/);
      await expect(page.getByRole('heading', { name: 'All Products', exact: true })).toBeVisible();
    },

    async addProduct(id: number): Promise<CartItem> {
      // Exclude duplicate links in hover overlays and recommended products.
      const card = page.locator('.features_items .productinfo').filter({
        has: page.locator(`[data-product-id="${id}"]`),
      });
      const name = (await card.locator('p').innerText()).trim();
      const priceText = await card.locator('h2').innerText();
      const price = Number(priceText.replace(/^Rs\.\s*/, '').replace(/,/g, '').trim());
      expect(Number.isFinite(price)).toBe(true);
      expect(price).toBeGreaterThan(0);

      await card.locator(`[data-product-id="${id}"]`).click();
      const modal = page.locator('#cartModal');
      await expect(modal).toBeVisible();
      await modal.getByRole('button', { name: 'Continue Shopping' }).click();
      await expect(modal).toBeHidden();
      return { id, name, price, quantity: 1 };
    },
  };
}
