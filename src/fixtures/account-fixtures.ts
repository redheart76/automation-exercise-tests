import { test as base, expect } from '@playwright/test';

import { createAccountsApi } from '../api/accounts';
import { createUser, type UserData } from '../data/user';
import { environment } from '../../config/environment';
import { checkAvailability, type Availability } from '../../config/availability';

type Fixtures = {
  registeredUser: UserData;
  unregisteredUser: UserData;
  environmentReady: void;
};

type WorkerFixtures = {
  environmentAvailability: Availability;
};

export const test = base.extend<Fixtures, WorkerFixtures>({
  environmentAvailability: [async ({ playwright }, use) => {
    const context = await playwright.request.newContext();
    let availability: Availability;
    try {
      availability = await checkAvailability(context, environment.baseUrl);
    } finally {
      await context.dispose();
    }
    await use(availability);
  }, { scope: 'worker' }],

  environmentReady: [async ({ environmentAvailability }, use) => {
    base.skip(!environmentAvailability.reachable, environmentAvailability.reason);
    await use();
  }, { auto: true }],

  unregisteredUser: async ({ request }, use) => {
    const user = createUser();
    const accounts = createAccountsApi(request, environment.baseUrl);
    try {
      await use(user);
    } finally {
      // Registration may fail before creating an account, or the UI may already delete it.
      const response = await accounts.deleteAccount(user.email, user.password);
      expect(response.ok(), 'UI account cleanup HTTP status').toBe(true);
      const body = await response.json();
      expect([
        { responseCode: 200, message: 'Account deleted!' },
        { responseCode: 404, message: 'Account not found!' },
      ]).toContainEqual(body);
    }
  },

  registeredUser: async ({ request }, use) => {
    const accounts = createAccountsApi(request, environment.baseUrl);
    const user = createUser();

    const createResponse = await accounts.createAccount(user);
    const createBody = await createResponse.json();

    try {
      expect(createResponse.ok(), 'Account creation HTTP status').toBe(true);
      // The API reports business outcomes in the JSON body,
      // so an HTTP success alone does not confirm account creation
      expect(createBody).toMatchObject({
        responseCode: 201,
        message: 'User created!',
      });

      await use(user);
    } finally {
      if (createBody.responseCode === 201) {
        const deleteResponse = await accounts.deleteAccount(
          user.email,
          user.password,
        );
        const deleteBody = await deleteResponse.json();

        expect(deleteResponse.ok(), 'Account cleanup HTTP status').toBe(true);
        expect(deleteBody).toMatchObject({
          responseCode: 200,
          message: 'Account deleted!',
        });
      }
    }
  },
});

export { expect };
