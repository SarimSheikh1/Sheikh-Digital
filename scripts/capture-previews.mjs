// Owner-run, isolated public capture. Every network request is checked; no credentials.
import { chromium } from "@playwright/test";
import dns from "node:dns/promises";
import fs from "node:fs/promises";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
const dataFile = new URL("../src/data/projects.json", import.meta.url);
const projects = JSON.parse(await fs.readFile(dataFile, "utf8"));
const publicIP = (ip) => {
  if (ip.includes(":"))
    return !/^(::|fc|fd|fe80|ff|2001:db8)/i.test(ip) && !ip.includes(".");
  const [a, b] = ip.split(".").map(Number);
  return !(
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
};
const cache = new Map();
async function safe(url) {
  const u = new URL(url);
  if (
    u.protocol !== "https:" ||
    u.username ||
    u.password ||
    (u.port && u.port !== "443")
  )
    return false;
  if (!cache.has(u.hostname)) {
    const ips = await dns.lookup(u.hostname, { all: true });
    cache.set(
      u.hostname,
      ips.length > 0 && ips.every((x) => publicIP(x.address)),
    );
  }
  return cache.get(u.hostname);
}
await fs.mkdir(new URL("../public/previews/", import.meta.url), {
  recursive: true,
});
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const p of projects) {
    if (
      !p.candidateUrl ||
      (p.desktopScreenshot && p.mobileScreenshot && p.liveUrls.length)
    )
      continue;
    try {
      if (!(await safe(p.candidateUrl))) throw Error("Non-public destination");
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        serviceWorkers: "block",
      });
      await context.route("**/*", async (route) => {
        try {
          const url = route.request().url();
          if (
            url.startsWith("data:") ||
            url.startsWith("blob:") ||
            (await safe(url))
          )
            await route.continue();
          else await route.abort();
        } catch {
          await route.abort();
        }
      });
      const page = await context.newPage();
      const response = await page.goto(p.candidateUrl, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForTimeout(6500);
      const text = await page.locator("body").innerText();
      if (
        !response?.ok() ||
        text.trim().length < 30 ||
        /DEPLOYMENT_NOT_FOUND|This deployment is protected|Log in to Vercel/i.test(
          text,
        )
      )
        throw Error(`Unavailable or protected: ${response?.status()}`);
      p.liveUrls = [page.url()];
      for (const [device, width, height] of [
        ["desktop", 1440, 900],
        ["mobile", 390, 844],
      ]) {
        await page.setViewportSize({ width, height });
        if (device === "mobile") {
          await page.reload({ waitUntil: "domcontentloaded" });
          await page.waitForTimeout(4500);
        }
        const buffer = await page.screenshot({
          fullPage: false,
          animations: "disabled",
        });
        const file = `${p.slug}-${device}.webp`;
        await sharp(buffer)
          .webp({ quality: 85 })
          .toFile(
            fileURLToPath(
              new URL(`../public/previews/${file}`, import.meta.url),
            ),
          );
        if (device === "desktop")
          await sharp(buffer)
            .resize(720)
            .webp({ quality: 80 })
            .toFile(
              fileURLToPath(
                new URL(
                  `../public/previews/${p.slug}-desktop-small.webp`,
                  import.meta.url,
                ),
              ),
            );
        p[`${device}Screenshot`] = `/previews/${file}`;
      }
      p.screenshotCapturedAt = "2026-10-10";
      p.verificationStatus = "Public deployment and repository verified";
      console.log(`Captured ${p.title}: ${p.liveUrls[0]}`);
      await context.close();
    } catch (e) {
      p.verificationStatus = "Repository verified; public preview unavailable";
      console.warn(`${p.title}: ${e.message}`);
    }
    await fs.writeFile(dataFile, JSON.stringify(projects, null, 2));
  }
} finally {
  await browser.close();
}
