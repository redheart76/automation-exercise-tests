import { expect, type Page } from '@playwright/test';
import { createAccountPage } from './account-page';
import { createCartPage } from './cart-page';

export function createHomePage(page: Page, baseUrl: string) {
  return {
    async navigateToHomePage() {
      await page.goto(new URL('/', baseUrl).href, {
        waitUntil: 'domcontentloaded',
      });
      await expect(
        page.getByRole('heading', { name: 'Features Items', exact: true }),
      ).toBeVisible();
    },

    async navigateToProducts() {
      await page.locator('header').getByRole('link', { name: /Products$/ }).click();
      await expect(page).toHaveURL(/\/products\/?$/);
      await expect(
        page.getByRole('heading', { name: 'All Products', exact: true }),
      ).toBeVisible();
    },

    async navigateToCart() {
      await createCartPage(page).open();
    },

    async logOut() {
      const header = page.locator('header');
      await header.getByRole('link', { name: /Logout$/ }).click();
      await expect(page).toHaveURL(/\/login\/?$/);
      await expect(
        header.getByRole('link', { name: /Signup \/ Login/ }),
      ).toBeVisible();
      await expect(header.getByRole('link', { name: /Logout$/ })).toHaveCount(0);
    },

    async deleteAccount() {
      await createAccountPage(page).deleteAccount();
    },
  };
}
