# Getting started

This is a short setup guide for anyone reviewing or running the tests.

## Requirements

- Node.js 22 LTS or newer
- npm
- Network access to the selected Automation Exercise environment

## Get the code

Clone the repository and enter it:

```bash
git clone https://github.com/redheart76/automation-exercise-tests.git
cd automation-exercise-tests
```

If the repository is private, the GitHub account used for cloning must have access.

## Install

```bash
npm ci
npx playwright install chromium
```

On a Linux CI runner, use `npx playwright install --with-deps chromium` so operating-system browser dependencies are installed as well.

## Environment selection

The default environment is dev (https://automationexercise.com). To run against the test environment, set TEST_ENV=test:

```bash
TEST_ENV=test npm run test:ui:test
TEST_ENV=test npm run test:api:test
```

The passwords in the environment configuration come from the exercise and are used for generated users. They are not stored in a .env file. REQUIRE_LIVE=1 makes an unreachable environment fail the run; without it, the fixtures skip tests when the host cannot be reached.

On PowerShell, set the variable on a separate line, for example `$env:TEST_ENV = 'test'; npm run test:ui:test`.

## Run commands

| Command | Purpose |
| --- | --- |
| `npm run check` | TypeScript check and ESLint |
| `npm test` | Required API and UI tests in Chromium |
| `npm run test:ui:dev` | UI tests against dev |
| `npm run test:ui:test` | UI tests against test |
| `npm run test:api:dev` | API tests against dev |
| `npm run test:api:test` | API tests against test |
| `npm run verify` | Checks followed by the required test suite |

Tests run headlessly by default. To see the browser locally:

```bash
npm run test:ui:dev -- --headed
```

To run one case, use a Playwright title filter, for example `npx playwright test tests/ui/checkout.spec.ts -g "TC14" --project=chromium`.

## Reports and traces

The HTML report is written to `playwright-report/`; open the latest report with:

```bash
npx playwright show-report
```

The configuration retains traces when a test fails. Open a trace with `npx playwright show-trace path/to/trace.zip`. These generated directories are ignored by Git. GitHub Actions uploads the report and test-results as a seven-day artifact.

The payment flow captures the application's short-lived success message before navigation, then checks the persistent order-confirmation page. The second check is the final order result.

## Troubleshooting

- A DNS, timeout, or connection error means the selected external environment is unavailable. Try the other environment or use REQUIRE_LIVE=1 when availability must be strict.
- The Playwright VS Code extension can reuse a browser while debugging. The repository sets playwright.reuseBrowser to false so normal trace settings remain effective.
- Do not commit node_modules, reports, traces, logs, or .env; they are covered by .gitignore.
