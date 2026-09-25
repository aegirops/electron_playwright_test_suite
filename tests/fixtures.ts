import { test as base, expect, _electron as electron } from "@playwright/test";
import type { ElectronApplication, Page } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HomePage } from "./pages/HomePage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mainPath = path.join(__dirname, "..", "main.js");

export const test = base.extend<{
  electronApp: ElectronApplication;
  window: Page;
  homePage: HomePage;
}>({
  electronApp: async ({}, use) => {
    const electronApp = await electron.launch({
      args: [mainPath],
      // The Nuxt dev server is already started by Playwright's `webServer` config.
      env: { ...process.env, ELECTRON_SKIP_SERVER_SPAWN: "1" },
    });
    await use(electronApp);
    await electronApp.close();
  },

  window: async ({ electronApp }, use) => {
    const window = await electronApp.firstWindow();
    await use(window);
  },

  homePage: async ({ window }, use) => {
    await use(new HomePage(window));
  },
});

export { expect };
