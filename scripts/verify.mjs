import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = { widths: [], errors: [], checks: [], performance: {} };
const page = await browser.newPage();
page.on("pageerror", (e) => report.errors.push(e.message));
try {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://127.0.0.1:5174", { waitUntil: "networkidle" });
    const sizes = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }));
    assert.ok(
      sizes.scroll <= sizes.viewport,
      `Overflow at ${width}: ${sizes.scroll}`,
    );
    report.widths.push({ width, ...sizes });
  }
  await page.locator(".filters select").nth(0).selectOption("Business");
  await page.locator(".filters select").nth(1).selectOption("CSS");
  await page.locator(".filters select").nth(2).selectOption("Vercel");
  assert.equal(await page.locator("[data-project]").count(), 2);
  await page.getByRole("button", { name: "Galaxy", exact: false }).click();
  assert.equal(await page.locator("[data-project]").count(), 2);
  await page.getByRole("button", { name: "Reset" }).click();
  await page.getByRole("button", { name: "Gallery", exact: false }).click();
  report.checks.push(
    "Combined category, technology and platform filters preserved across views",
  );
  await page.getByLabel("Search projects").fill("AERION");
  assert.equal(await page.locator("[data-project]").count(), 1);
  await page.getByRole("button", { name: "List", exact: false }).click();
  assert.equal(await page.locator("[data-project]").count(), 1);
  await page.getByRole("button", { name: "Reset" }).click();
  assert.equal(await page.locator("[data-project]").count(), 11);
  await page.getByLabel("Search projects").fill("nonexistent");
  await page.getByText("No ideas in this orbit.").waitFor();
  await page.getByRole("button", { name: "Reset" }).click();
  report.checks.push("Search, view synchronization, reset and empty state");
  await page.keyboard.press("Control+k");
  await page.getByRole("dialog").waitFor();
  await page.getByLabel("Search commands").fill("AERION");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /AERION-DRIVE/ })
    .click();
  await page.getByRole("heading", { level: 1, name: /AERION-DRIVE/ }).waitFor();
  report.checks.push("Command palette and project navigation");
  assert.equal(await page.locator("iframe").count(), 1);
  await page.locator("iframe").waitFor();
  const frame = page.frameLocator("iframe");
  await frame
    .getByRole("heading", { name: /ENGINEERED/i })
    .waitFor({ timeout: 30000 });
  report.checks.push(
    "Actual AERION project rendered inside the interactive frame, verified by its heading",
  );
  await page.getByRole("button", { name: "Stop", exact: false }).click();
  assert.equal(await page.locator("iframe").count(), 0);
  await page.getByRole("button", { name: "Interface capture" }).click();
  await page.getByRole("tab", { name: "mobile" }).click();
  assert.equal(
    await page
      .getByRole("tab", { name: "mobile" })
      .getAttribute("aria-selected"),
    "true",
  );
  const screenshot = page.getByRole("button", { name: /Enlarge AERION-DRIVE/ });
  if (await screenshot.count()) {
    await screenshot.click();
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    report.checks.push("Genuine mobile preview lightbox and Escape close");
  }
  await page.reload();
  await page.getByRole("heading", { level: 1, name: /AERION-DRIVE/ }).waitFor();
  report.checks.push("Direct project route reload");
  await page.goto("http://127.0.0.1:5174/projects/todo-app");
  await page.getByText("This deployment needs public access.").waitFor();
  assert.equal(await page.locator("iframe").count(), 0);
  report.checks.push(
    "Unavailable deployment has honest pending state and no fabricated working version",
  );
  await page.setViewportSize({ width: 320, height: 844 });
  const inventory = JSON.parse(
    await fs.readFile("src/data/projects.json", "utf8"),
  );
  for (const p of inventory) {
    await page.goto(`http://127.0.0.1:5174/projects/${p.slug}`);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Detail overflow: ${p.slug}`,
    );
  }
  report.checks.push("All 11 direct project routes fit a 320px viewport");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://127.0.0.1:5174");
  await page
    .getByRole("button", { name: "Skip", exact: true })
    .click()
    .catch(() => {});
  await page.screenshot({ path: "qa-desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "qa-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 844, height: 390 });
  await page.reload();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  report.checks.push("Landscape and reduced-motion CSS fallback");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.evaluate(() => localStorage.setItem("sarim-motion", "on"));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await page.waitForTimeout(2000);
  await page.getByRole("button", { name: "Galaxy", exact: false }).click();
  await page.waitForTimeout(800);
  assert.equal(await page.locator("[data-project]").count(), 11);
  await page.getByRole("button", { name: "Gallery", exact: false }).click();
  await page.waitForTimeout(800);
  report.checks.push("Motion-enabled GSAP Flip views and animation startup");
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await fs.writeFile("qa-report.json", JSON.stringify(report, null, 2));
  await browser.close();
}
