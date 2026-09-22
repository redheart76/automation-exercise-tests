import { randomUUID } from 'node:crypto';

import { test, expect } from '../../src/fixtures/account-fixtures';
import { createAccountsApi } from '../../src/api/accounts';
import { environment } from '../../config/environment';

test.describe('Verify login API', () => {
  test('API 7: accepts valid credentials', async ({
    request,
    registeredUser,
  }) => {
    const accounts = createAccountsApi(request, environment.baseUrl);

    const response = await accounts.verifyLogin(
      registeredUser.email,
      registeredUser.password,
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject({
      responseCode: 200,
      message: 'User exists!',
    });
  });

  test('API 8: rejects a request without email', async ({ request }) => {
    const response = await request.post(
      `${environment.baseUrl}/api/verifyLogin`,
      {
        form: {
          password: 'missing-email-test',
        },
      },
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject({
      responseCode: 400,
      message:
        'Bad request, email or password parameter is missing in POST request.',
    });
  });

  test('API 9: rejects the DELETE method', async ({ request }) => {
    const response = await request.delete(
      `${environment.baseUrl}/api/verifyLogin`,
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject({
      responseCode: 405,
      message: 'This request method is not supported.',
    });
  });

  test('API 10: rejects invalid credentials', async ({ request }) => {
    const accounts = createAccountsApi(request, environment.baseUrl);

    // Generate an address that has not been registered.
    const email = `unregistered-${randomUUID()}@example.com`;

    const response = await accounts.verifyLogin(email, 'invalid-password');

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body).toMatchObject({
      responseCode: 404,
      message: 'User not found!',
    });
  });
});
