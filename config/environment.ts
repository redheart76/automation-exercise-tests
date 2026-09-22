export type TestEnvironment = 'dev' | 'test';

const environmentName = process.env.TEST_ENV ?? 'dev';

const environments = {
  dev: {
    name: 'dev',
    baseUrl: 'https://automationexercise.com',
    password: 'D3v3nv1r0m3nt',
  },
  test: {
    name: 'test',
    baseUrl: 'https://test.automationexercise.com',
    password: 'T35t3nv1r0m3nt',
  },
} as const;

if (environmentName !== 'dev' && environmentName !== 'test') {
  throw new Error(
    `Unsupported TEST_ENV "${environmentName}". Use "dev" or "test".`,
  );
}

export const environment = environments[environmentName];
