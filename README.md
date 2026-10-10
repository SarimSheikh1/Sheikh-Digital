# SARIM / THE IDEA UNIVERSE

A complete frontend portfolio for Sarim Sheikh, built with React + Vite, JavaScript/JSX, Tailwind CSS, GSAP/ScrollTrigger/Flip, Motion, Three.js, React Three Fiber, Drei, Lenis and React Router. It shows only the 11 unique repositories explicitly selected by the owner. Repeated names in the supplied reference list appear once.

## Run on Windows PowerShell

Install Node.js 22.12 or newer (Node 24 recommended). Extract this folder and open PowerShell inside it:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the Local URL printed in the terminal. `npm.cmd` avoids PowerShell's blocked `npm.ps1` execution-policy issue. No credentials or backend are required.

```powershell
npm.cmd run build
npm.cmd run preview
npm.cmd test
```

## Project data and genuine previews

Edit `src/data/projects.json`. Each record has its own id, slug, title, description, category, technologies, repositoryUrl, liveUrls, desktopScreenshot, mobileScreenshot, screenshotCapturedAt, sourcePlatform, featured, verificationStatus and updatedAt. `overview`, README excerpt and topics provide evidence and context. Project details are shareable at `/projects/:slug`.

The selected repositories were discovered through the public GitHub API. The importer supports pagination and refreshes only the existing selection; it never expands the public portfolio to the entire account:

```powershell
npm.cmd run import:projects
```

GitHub's unauthenticated rate limits can cause partial metadata failures. Existing data remains usable; no browser-side API dependency exists. Metadata and screenshots are checked into source. Do not run import and capture simultaneously, since both update the same JSON file. Categories are editorial groupings, not tested feature claims. Language metadata and README descriptions establish tool relationships, not personal mastery.

Add genuine desktop and mobile screenshots to `public/previews/`, preferably WebP. Capture each device independently; a resized desktop image is not a mobile capture. Set the two screenshot paths and capture date. For responsive desktop images, also add `project-slug-desktop-small.webp` (720px wide) alongside `project-slug-desktop.webp` (1440px). If your image names differ, update the srcSet convention in `src/components/Preview.jsx`. Unavailable previews display an honest message. Detail pages have Desktop/Mobile tabs and a native modal lightbox.

`scripts/capture-previews.mjs` is an optional local, owner-run helper using installed Google Chrome. It captures only repository-supplied candidate URLs and skips existing complete captures. It rejects non-HTTPS and private IP destinations, checks subresources, blocks service workers and has no credentials. It is not exposed as a server or public capture API. Its network checks are defense in depth, not a hardened multi-tenant screenshot service; use a network-isolated container if deploying automation. Review every resulting image and URL before publishing.

## Use the actual projects

Each publicly verified deployment has **Use project** and **Open website** actions. The project page immediately displays a single interactive live website, with desktop/mobile frame sizes, reload, stop, and direct open. Interface captures remain a separate fallback. Websites are not loaded together on the gallery page. Iframe load events are never presented as proof of successful rendering. If a website is blank or blocks embedding, the direct website action remains available; CSP, authentication and X-Frame-Options are not bypassed. External websites retain their own availability, privacy and backend requirements.

To connect a newly deployed project, add its verified HTTPS URL to `liveUrls` in the matching JSON record, set `candidateUrl` to the same URL for optional capture, update `sourcePlatform` and `verificationStatus`, then rebuild. Public GitHub records now show production deployments for the five restricted projects; their recorded URLs redirect anonymous visitors to Vercel login. A publicly accessible production domain is needed for each. No fake local version has been substituted.

## Social links

Edit `social` in `src/data/projects.js`. GitHub is configured. Add an actual email address to enable `mailto:`, and verified Instagram/LinkedIn URLs if desired. Empty entries stay hidden. There is no fake contact form, CV, testimonial, or frontend authentication.

## Animation and accessibility

GSAP owns typography, reveals, reading progress, pointer label effects and workflow text transitions. ScrollTrigger coordinates scroll scenes. Flip owns explorer layout changes. Motion owns menu and dialog presence, on separate elements. Lenis uses a single GSAP ticker callback and updates ScrollTrigger; cleanup removes the callback, observers, listeners and contexts. Native scrolling works with motion off. No scroll trapping or forced loaders.

The lazy 3D artifact uses R3F/Three/Drei, capped DPR, low geometry complexity, offscreen/hidden unmounting, mobile opt-out, a CSS fallback, and context-loss fallback. Reduced-motion defaults to off; the preference persists. Native dialog provides modal focus containment, Escape handling and focus restoration. The command palette supports Ctrl/Cmd+K, visible touch activation, project search, sections and view commands. Galaxy becomes a screenshot-led horizontal exhibition on mobile; Gallery and List remain available.

## Deploy the frontend

Nothing has been pushed or deployed automatically.

**Vercel:** import the source folder, select Vite, use install `npm ci`, build `npm run build`, output `dist`. `vercel.json` includes SPA rewrites for direct project routes. No provider token is required in the frontend.

**Netlify:** choose build `npm run build` and publish `dist`. `public/_redirects` is copied into the build and provides SPA fallback. If this is a subfolder of your repository, set its base directory to `idea-universe`.

For other static hosts, configure a fallback to `index.html` while serving assets normally. Domain-subdirectory hosting requires updating Vite's base and router basename.

## Environment and security

`.env.example` documents that no environment variables are required. Never put tokens, passwords or provider secrets in `VITE_*`, public files or project data. Vercel/Netlify dashboard URLs are not portfolio demos. There is no provider administration service, login or backend to host.

## Verification

See `TEST-RESULTS.md` and `qa-report.json` for actual checks and limitations. Optional browser QA uses installed Chrome:

```powershell
# Leave the development server running in another terminal.
node scripts/verify.mjs
```

The browser helper defaults to port 5174 for the checked session; adjust its URL if your terminal prints another port. The ZIP excludes node_modules, dist, raw API inventory, QA PNGs and implementation-only helpers. The lockfile is included for reproducible installation.

## Official implementation references

[Vite](https://vite.dev/guide/), [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite), [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/), [Motion React](https://motion.dev/docs/react), [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction), [Drei](https://drei.docs.pmnd.rs/), [Lenis synchronization](https://github.com/darkroomengineering/lenis), [React Router](https://reactrouter.com/start/declarative/routing).
