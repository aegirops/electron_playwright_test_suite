const { _electron: electron } = require("@playwright/test");

(async () => {
  const app = await electron.launch({
    args: ["main.js"],
    env: { ...process.env, ELECTRON_SKIP_SERVER_SPAWN: "1" },
  });
  const win = await app.firstWindow();
  await win.waitForLoadState("networkidle");
  const locator = win.getByRole("link", { name: "Customers" });
  const count = await locator.count();
  console.log("count:", count);
  for (let i = 0; i < count; i++) {
    const el = locator.nth(i);
    console.log(
      i,
      await el.evaluate((e) => e.outerHTML.slice(0, 300)),
      "visible:",
      await el.isVisible(),
    );
  }
  await app.close();
})();
