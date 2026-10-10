import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.addInitScript(() => {
    localStorage.setItem("sarim-motion", "on");
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (type === "webgl" || type === "webgl2") return null;
      return original.call(this, type, ...args);
    };
  });
  await page.goto("http://127.0.0.1:5174");
  await page.locator(".silver-knot").waitFor();
  assert.equal(await page.locator(".artifact canvas").count(), 0);
  await page.getByRole("button", { name: "Galaxy", exact: false }).click();
  assert.equal(await page.locator("[data-project]").count(), 11);
  await page.goto("http://127.0.0.1:5174/#invalid[hash");
  await page.getByRole("heading", { level: 1 }).waitFor();
  await fs.writeFile(
    "fallback-report.json",
    JSON.stringify(
      {
        webglDisabled: true,
        cssFallbackVisible: true,
        allProjectsDiscoverable: true,
        unrecognizedHashSafe: true,
      },
      null,
      2,
    ),
  );
  console.log("Forced WebGL absence: CSS fallback and all 11 projects passed.");
} finally {
  await browser.close();
}
