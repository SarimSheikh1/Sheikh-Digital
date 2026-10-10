import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const projects = JSON.parse(
  await fs.readFile("src/data/projects.json", "utf8"),
);
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  const live = projects.filter((p) => p.liveUrls.length);
  for (let i = 0; i < live.length; i += 3) {
    await Promise.all(
      live.slice(i, i + 3).map(async (p) => {
        const context = await browser.newContext({ reducedMotion: "reduce" });
        const page = await context.newPage();
        try {
          await page.goto(`http://127.0.0.1:5174/projects/${p.slug}`);
          await page.getByRole("button", { name: "Start project" }).click();
          await page.waitForTimeout(9000);
          const text = await page
            .frameLocator("iframe")
            .locator("body")
            .innerText({ timeout: 15000 });
          const shown = text.trim().length > 30;
          results.push({
            title: p.title,
            renderedBody: shown,
            bodyCharacters: text.length,
          });
        } catch (e) {
          results.push({
            title: p.title,
            renderedBody: false,
            error: e.message.slice(0, 200),
          });
        } finally {
          await context.close();
        }
      }),
    );
  }
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.route("https://aerion-drive.vercel.app/**", (r) => r.abort());
  await page.goto("http://127.0.0.1:5174/projects/aerion-drive");
  await page.getByRole("button", { name: "Start project" }).click();
  const fallback = await page
    .getByRole("link", { name: "Blank or blocked? Open website" })
    .getAttribute("href");
  await page.getByRole("button", { name: "Stop", exact: false }).click();
  const stopped = (await page.locator("iframe").count()) === 0;
  await page.getByLabel("Open search command palette").click();
  await page.getByRole("dialog").waitFor();
  for (let i = 0; i < 30; i++) await page.keyboard.press("Tab");
  const trapped = await page.evaluate(
    () => !!document.activeElement.closest("dialog"),
  );
  await page.keyboard.press("Escape");
  const restored = await page
    .getByLabel("Open search command palette")
    .evaluate((el) => el === document.activeElement);
  await context.close();
  const report = {
    liveEmbeds: results,
    blockedFrameDirectLink: fallback,
    stopUnmountsIframe: stopped,
    dialogFocusContained: trapped,
    dialogFocusRestored: restored,
  };
  await fs.writeFile("embed-report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
