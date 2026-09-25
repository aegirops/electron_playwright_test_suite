---
applyTo: "e2e/*.spec.ts,e2e/**/*.spec.ts"
---

# Playwright UI Testing Architecture and Format

## Rules

- Test files must end with `.spec.ts` suffix and be located in the `e2e` directory or its subdirectories
- Playwright Tests must use POM (Page Object Model) architecture
- Each test file should correspond to a specific feature or page of the application
- Test files should be organized in a way that reflects the application's structure
- Use descriptive names for test files that clearly indicate their purpose

## Locator Strategy Recommendation:

Use the most stable and intention-revealing locators, in this order:

1. `data-testid` or similar test attributes
2. [Role and accessible name](https://playwright.dev/docs/locators#roles) (e.g., `getByRole`)
3. Label text (`getByLabel`)
4. Placeholder, alt text, title, or visible text
5. Stable attribute selectors (e.g., `aria-label`, `name`)
6. CSS selectors by class/tag (only if stable)
7. Element ID (only if unique and not auto-generated)
8. XPath (avoid unless absolutely necessary)

_Prefer high-level locators (test IDs, roles, labels); avoid brittle selectors like XPath or unstable class names._

## Run test rules

- When the user ask to run a test, run the test headless (avoid starting browser)
