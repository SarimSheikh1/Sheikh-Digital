# Verification — 10 October 2026

## Follow-up update

The project detail now automatically displays the actual live website without an initial Start button. A focused browser check verified the real AERION heading, immediate iframe presence, the Stop action, and the honest restricted-deployment state; see `autostart-report.json`. Public GitHub deployment records confirm production deployments for the other five selected projects, but recorded URLs redirect anonymous visitors to Vercel login. Their public production domains are required before enabling their interactive viewers. No protection settings were changed.

- Production build passed with the exact 11 owner-selected projects. Horror_die_Website is excluded.
- Three automated tests passed: combined filtering, reset/case-insensitive search, and real importer pagination behavior with multiple mocked pages. The live import read 70 public repositories and refreshed only the curated selection. GitHub rate limits and missing READMEs are handled as partial failures without breaking the frontend.
- Browser checks passed at 320, 360, 390, 430, 768, 1024 and 1440 CSS pixels with zero unintended page overflow. All 11 project detail routes also fit 320px. Landscape was checked at 844 × 390. Forced WebGL absence also passed: the CSS artifact remained visible and all 11 projects stayed discoverable (`fallback-report.json`).
- Search, combined category/technology/platform filters, shared view results, reset, empty states, command palette, direct-route reload, preview tabs, screenshot lightbox, Escape, reduced motion, CSS artifact fallback, motion-enabled Flip, and pending deployment states passed. No page exceptions were observed. Reports are in `qa-report.json`.
- All six actual live websites rendered nonempty interface text inside their interactive frames. AERION was also identified by its actual heading. Simulated blocked-frame fallback, iframe unmounting, modal focus containment and focus restoration passed; see `embed-report.json`. A frame load event alone is not used to infer successful embedding.
- Six real deployments have independently captured desktop (1440 × 900) and mobile (390 × 844) homepage images, plus 720px responsive desktop variants. Representative source images and complete portfolio layouts were visually inspected. Missing previews remain clearly labeled.
- The todo-app repository homepage returned HTTP 404. Four other selected projects have no supplied public deployment URL. They retain their source links and pending states; see `PENDING-DEPLOYMENTS.md`.
- No backend, provider secrets, frontend login, public registration service, fake form success, guessed social links, invented projects, GitHub push or public portfolio deployment was implemented.

## Production performance measurement

Measured against the production preview on localhost in installed headless Chrome, with a fresh browser context per viewport, no network/CPU throttling, and reduced motion. These are single local measurements, not a Lighthouse score or field-performance claim:

| Viewport       | DOM ready | First contentful paint | Largest contentful paint | Layout shift | Resource transfer |
| -------------- | --------- | ---------------------- | ------------------------ | ------------ | ----------------- |
| Mobile 390px   | 489ms     | 1632ms                 | 1632ms                   | 0            | 205,937 bytes     |
| Desktop 1440px | 185ms     | 676ms                  | 676ms                    | 0            | 205,637 bytes     |

`performance-report.json` contains the measured values and conditions. The production build reported roughly 198KB gzip for the initial JavaScript and 7KB gzip CSS. The separately loaded artifact chunk is roughly 256KB gzip and is disabled on mobile/reduced-motion views. Vite warns about large JavaScript chunks; full-motion desktop 3D adds meaningful cost. No untested score is claimed.

## Limits

No real-device Safari/iOS testing, exhaustive assistive-technology audit, slow-network benchmarking, production-host SPA rewrite testing, or testing of external projects' payment/authentication/business workflows was performed. Desktop/Mobile in the interactive viewer change frame width; only the capture tab uses actual device-specific screenshots. WebGL absence was explicitly forced in the browser; GPU context-loss recovery was implemented but not manually induced. Hosted website availability and embedding rules may change. Five live URLs and optional email/social profiles remain owner configuration.
