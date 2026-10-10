import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
try {
  for (const [name, width, height] of [
    ["mobile", 390, 844],
    ["desktop", 1440, 900],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) window.metrics.lcp = e.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const e of list.getEntries())
          if (!e.hadRecentInput) window.metrics.cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("http://127.0.0.1:5175", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    results.push(
      await page.evaluate((name) => {
        const n = performance.getEntriesByType("navigation")[0];
        return {
          name,
          viewport: innerWidth,
          dclMs: Math.round(n.domContentLoadedEventEnd),
          loadMs: Math.round(n.loadEventEnd),
          fcpMs: Math.round(
            performance.getEntriesByName("first-contentful-paint")[0]
              ?.startTime || 0,
          ),
          lcpMs: Math.round(window.metrics.lcp),
          cls: Number(window.metrics.cls.toFixed(4)),
          transferredBytes: performance
            .getEntriesByType("resource")
            .reduce((a, r) => a + r.transferSize, 0),
        };
      }, name),
    );
    await context.close();
  }
  await fs.writeFile(
    "performance-report.json",
    JSON.stringify(
      {
        conditions:
          "Production preview on localhost; headless installed Chrome; unthrottled; reduced motion; one cold context per viewport; not a Lighthouse score or field measurement.",
        results,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
