import { test, expect } from "./fixtures";

test("launches the app and opens a window", async ({ electronApp, window }) => {
  const appPath = await electronApp.evaluate(({ app }) => app.getAppPath());
  expect(appPath).toBeTruthy();

  expect(await window.title()).toBe("Nuxt Dashboard Template");
});

test("renders the dashboard navigation", async ({ homePage }) => {
  await expect(homePage.inboxLink).toBeVisible();
  await expect(homePage.customersLink).toBeVisible();
  await expect(homePage.settingsLink).toBeVisible();
});

test("navigates to the customers page", async ({ window, homePage }) => {
  await homePage.gotoCustomers();
  await expect(window).toHaveURL(/\/customers$/);
});
