import type { APIRequestContext } from '@playwright/test';

export type Availability = {
  reachable: boolean;
  reason?: string;
};

export async function checkAvailability(
  request: APIRequestContext,
  baseUrl: string,
  timeout = 8000,
): Promise<Availability> {
  try {
    const response = await request.get(baseUrl, { timeout });
    const status = response.status();
    await response.dispose();

    // A responding server with an HTTP error must not silently skip tests.
    if (status !== 200) {
      throw new Error(`Environment check failed: ${baseUrl} returned HTTP ${status}`);
    }

    return { reachable: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (/ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ENETUNREACH|EHOSTUNREACH|ETIMEDOUT|Timeout .*exceeded/i.test(message)) {
      return {
        reachable: false,
        reason: `Environment unreachable: ${baseUrl}. ${message}`,
      };
    }

    throw error;
  }
}
