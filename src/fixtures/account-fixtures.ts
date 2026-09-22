import { test as base, expect } from '@playwright/test';

import { createAccountsApi } from '../api/accounts';
import { createUser, type UserData } from '../data/user';
import { environment } from '../../config/environment';

type Fixtures = {
  registeredUser: UserData;
};

export const test = base.extend<Fixtures>({
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
