import { expect, type Page } from '@playwright/test';
import type { UserData } from '../data/user';

export function createAccountPage(page: Page) {
  return {
    async openSignup() {
      await page
        .locator('header')
        .getByRole('link', { name: /Signup \/ Login/ })
        .click();

      await expect(
        page.getByRole('heading', { name: 'New User Signup!' }),
      ).toBeVisible();
    },

    async register(user: UserData) {
      await page.getByTestId('signup-name').fill(user.name);
      await page.getByTestId('signup-email').fill(user.email);
      await page.getByTestId('signup-button').click();

      await expect(
        page.getByText('Enter Account Information', { exact: true }),
      ).toBeVisible();

      await page.getByLabel(`${user.title}.`, { exact: true }).check();

      await page.getByTestId('password').fill(user.password);
      await page.getByTestId('days').selectOption(user.birth_date);
      await page.getByTestId('months').selectOption(user.birth_month);
      await page.getByTestId('years').selectOption(user.birth_year);

      await page.getByLabel('Sign up for our newsletter!').check();
      await page
        .getByLabel('Receive special offers from our partners!')
        .check();

      const addressFields = {
        first_name: user.firstname,
        last_name: user.lastname,
        company: user.company,
        address: user.address1,
        address2: user.address2,
        state: user.state,
        city: user.city,
        zipcode: user.zipcode,
        mobile_number: user.mobile_number,
      };

      for (const [field, value] of Object.entries(addressFields)) {
        await page.getByTestId(field).fill(value);
      }

      await page.getByTestId('country').selectOption({ label: user.country });

      await page.getByTestId('create-account').click();

      await expect(page.getByTestId('account-created')).toHaveText(
        'Account Created!',
      );

      await page.getByTestId('continue-button').click();

      await expect(page.locator('header')).toContainText(
        `Logged in as ${user.name}`,
      );
    },

    async deleteAccount() {
      await page
        .locator('header')
        .getByRole('link', { name: /Delete Account/ })
        .click();

      await expect(page.getByTestId('account-deleted')).toHaveText(
        'Account Deleted!',
      );

      await page.getByTestId('continue-button').click();

      await expect(
        page.locator('header').getByRole('link', { name: /Signup \/ Login/ }),
      ).toBeVisible();
    },
  };
}
