import type { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly homeLink: Locator;
  readonly inboxLink: Locator;
  readonly customersLink: Locator;
  readonly settingsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Scope to the sidebar nav to avoid colliding with the duplicate collapsed/tooltip link Nuxt UI renders for each item
    const sidebar = page.locator("#dashboard-sidebar-default");
    this.homeLink = sidebar.getByRole("link", { name: "Home", exact: true });
    // "Inbox" has a count badge appended to its accessible name (e.g. "Inbox 4"), so match by substring
    this.inboxLink = sidebar.getByRole("link", { name: "Inbox" });
    this.customersLink = sidebar.getByRole("link", {
      name: "Customers",
      exact: true,
    });
    // "Settings" is a collapsible section trigger, not a link
    this.settingsLink = sidebar.getByRole("button", {
      name: "Settings",
      exact: true,
    });
  }

  async gotoCustomers() {
    await this.customersLink.click();
  }
}
