import type { APIRequestContext, APIResponse } from '@playwright/test';

import type { UserData } from '../data/user';

export function createAccountsApi(request: APIRequestContext, baseUrl: string) {
  return {
    createAccount(user: UserData): Promise<APIResponse> {
      return request.post(`${baseUrl}/api/createAccount`, {
        form: user,
      });
    },

    verifyLogin(email: string, password: string): Promise<APIResponse> {
      return request.post(`${baseUrl}/api/verifyLogin`, {
        form: {
          email,
          password,
        },
      });
    },

    deleteAccount(email: string, password: string): Promise<APIResponse> {
      return request.delete(`${baseUrl}/api/deleteAccount`, {
        form: {
          email,
          password,
        },
      });
    },
  };
}
