import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:5176/projects/aerion-drive");
  assert.equal(await page.locator("iframe").count(), 1);
  assert.equal(
    await page.getByRole("button", { name: "Start project" }).count(),
    0,
  );
  await page
    .frameLocator("iframe")
    .getByRole("heading", { name: /ENGINEERED/i })
    .waitFor({ timeout: 30000 });
  await page.getByRole("button", { name: "Stop", exact: false }).click();
  assert.equal(await page.locator("iframe").count(), 0);
  await page.goto("http://127.0.0.1:5176/projects/sniper-shadow");
  await page.getByText("This deployment needs public access.").waitFor();
  assert.equal(await page.locator("iframe").count(), 0);
  const report = {
    actualProjectAutomaticallyVisible: true,
    noInitialStartButton: true,
    realHeadingVerified: true,
    stopWorks: true,
    protectedDeploymentHonest: true,
  };
  await fs.writeFile("autostart-report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
}
