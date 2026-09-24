# Automation Exercise Tests

This is my TypeScript and Playwright solution for the Automation Exercise technical exercise. It covers the required checkout registration flows and the verifyLogin API scenarios, with shared page, API, fixture, and test-data helpers.

## Coverage

| Area | Coverage |
| --- | --- |
| UI | TC14: register during checkout; TC15: register before checkout |
| API | API 7 valid credentials; API 8 missing email; API 9 unsupported DELETE; API 10 invalid credentials |
| Environments | dev and test selected with TEST_ENV; unreachable environments can be skipped or made strict with REQUIRE_LIVE=1 |
| Quality checks | TypeScript type checking, ESLint, Playwright HTML reports and failure traces |
| CI | GitHub Actions installs dependencies, checks the project, runs Chromium tests, and uploads reports and traces |

I used Faker-generated users, API setup and cleanup fixtures, function-based page objects, and data-qa selectors through Playwright's configured test ID attribute. The API helpers send form data in the format expected by the application.

## Quick start

See [GETTING_STARTED.md](GETTING_STARTED.md) for setup, environment selection, test commands, reports, and troubleshooting.

```bash
npm ci
npx playwright install chromium
npm run verify
```

## CI result

The current GitHub Actions workflow has a successful Chromium run: 6 tests passed in 37.7 seconds. The type check, lint check, browser installation, test run, and artifact upload all completed successfully. The run is available at [GitHub Actions run 35940097019](https://github.com/redheart76/automation-exercise-tests/actions/runs/35940097019).

## Remaining work

The exercise is intended to fit into 4–6 hours, so I focused first on the required API and UI flows, environment handling, reusable test structure, failure diagnostics, and CI. I did not have time to complete the following items:

| Item | Status and reason |
| --- | --- |
| Cross-browser execution | Chromium is covered in CI. Firefox and WebKit are configured, but I did not have time to run and verify them. |
| API interception or mocking | I did not have time to add mocked API responses. The current tests use the live application. |
| Additional negative tests | I covered the required API 7–10 and UI TC14–15 cases. With more time, I would also test duplicate registration, a missing password, and an incorrect password for an existing account. |
| Systematic accessibility review | I did not have time to carry out a dedicated accessibility review or add automated accessibility checks. |
| Performance measurements | The suite avoids unnecessary browser setup and uses API fixtures, but I did not collect baseline or trend measurements. |
| Pre-commit hook | I did not add a pre-commit hook within the time available. Type checking, linting, and tests run in GitHub Actions. A useful next step would be to run the faster type and lint checks before each commit. |

These are simply the boundaries of this submission; they are not claims that the application is defect-free.

## Feedback and issues

See [ISSUES.md](ISSUES.md) for observations from testing and [FEEDBACK.md](FEEDBACK.md) for suggestions about the exercise.
