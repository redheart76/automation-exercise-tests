export type TestEnvironment = 'dev' | 'test';

const environmentName = (process.env.TEST_ENV ?? 'test') as TestEnvironment;

const environments = {
  dev: {
    name: 'dev',
    baseUrl: 'https://automationexercise.com',
  },
  test: {
    name: 'test',
    baseUrl: 'https://test.automationexercise.com',
  },
} as const;

if (!(environmentName in environments)) {
  throw new Error(
    `Unsupported TEST_ENV "${environmentName}". Use "dev" or "test".`,
  );
}

export const environment = environments[environmentName];
