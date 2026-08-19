@AGENTS.md

# Project: Shriansh Jena Portfolio (EDGE IS ENGINEERED)

Single-page, dark-only, capital-markets portfolio. Next.js 16 App Router +
TypeScript strict + Tailwind v4 + GSAP 3.15 + Lenis + lazy Spline hero.
Fully static: one route, no API endpoints.

## Non-negotiable conventions

1. **gsap is imported only from `@/lib/gsap`** (single registration point).
   One RAF loop: the GSAP ticker drives `lenis.raf`; never add a second
   scroll or RAF system.
2. **Every animated component implements three tiers** with `gsap.matchMedia`
   and `MEDIA.full/lite/reduce` from `@/lib/motion`. reduce = final states
   visible, no pins, native scroll, no Spline. One deliberate exception:
   the Spline hero mounts on full AND lite (robot animates on phones,
   deviceMemory >= 4), never on reduce.
3. **One engine per property**: scroll scrubs animate wrapper elements,
   pointer effects animate inner elements, CSS transitions never touch a
   GSAP-driven property.
4. **All copy lives in `src/content/site.ts`** (typed by `content/types.ts`).
   Never hardcode copy in components; sections take slices as props.
   Copy voice: no em dashes, no exclamation marks, numbers or named systems
   in every claim, trading-desk register.
5. **Design tokens only** (canvas/ink/ink-2/line/fg/muted/steel/accent/amber
   + eyebrow/display-hero/display-heading/mono-nums utilities). No shadows,
   no gradients (photo scrim excepted), no glassmorphism, no new rounded
   corners (pill CTA and status dots are the only exceptions), weight 400
   typography. Amber has a strict site-wide budget (bonds pulse, one ticker
   delta, compliance badge).
6. **Accessibility bar**: WCAG 2.2 AA. Decorative/3D variants are aria-hidden
   and always paired with an accessible equivalent. Small blue text uses
   steel, never accent (contrast). Autonomous motion longer than 5s ships a
   HOLD/RUN control (ticker, dial, hero 3D); attention pulses stay under one
   sub-5s cycle; the footer clock's essential exception is recorded in code.
7. **Two text systems, used deliberately**: `ScrambleText` (color-scanline
   decrypt) for chapter headings, eyebrows and the hero; `Decode`
   (`fx/Decode.tsx`, log-entry left-to-right resolve) for body copy and mono
   readouts, with `reserveLayout` on any multi-line string and
   `start="top bottom"` for page-floor consumers.

## Machine-specific gotchas (this dev machine)

- The project sits on an exFAT volume and the user's Antigravity IDE holds
  file handles on previously used dist directories, which makes
  `mkdir`/`scandir` fail with EPERM. Current local dist dir is `.dist4`
  (`next.config.ts`; Vercel builds use the standard `.next`), excluded in
  `tsconfig.json` and `.vscode/settings.json` (watcher excludes). The IDE
  latches onto each newly created dist dir until it is restarted (rotations
  so far: `.next-dist`, `.build`, `.dist`, `.dist2`, `.dist3`, `.dist4`), so
  when a build EPERMs again, do not fight the handle: rotate `distDir` to a
  fresh name and add it to all three exclusion lists. `handle64.exe`
  identifies holders.
- The default `.next` and older `.next-dist`/`.build` folders may linger
  locked until the IDE closes; they are gitignored, leave them.
- `next dev` file-watching on this volume can serve stale modules after
  edits; if the browser shows old code with the disk correct, restart the
  dev server.
- GSAP refreshes ScrollTriggers in CREATION order and only document-sorts
  when some trigger declares `refreshPriority`. Any pin created after first
  paint (the helix mounts via a state swap) must set `refreshPriority` and
  dispatch `ScrollTrigger.sort(); ScrollTrigger.refresh();`, or every
  trigger below it measures against pre-pin layout and fires early.
- Headless Chrome here needs `--disable-gpu` (see
  `~/.claude/scripts/ab-chrome.sh`); WebGL then fails, so the Spline scene
  only renders with `--enable-unsafe-swiftshader --use-angle=swiftshader`.
  Web3Forms sits behind Cloudflare bot protection: form submissions cannot be
  fully verified from automation, only from a real browser.

## Content facts worth knowing

- CARLTSOLAS links point to carltsolas-website.vercel.app because
  carltsolas.com is currently a parked GoDaddy domain.
- The Web3Forms access key is a public form identifier (vendor free-tier
  design); it is not a secret. See SECURITY.md.
- The audio tracks are unlicensed commercial recordings kept at the owner's
  request; see CREDITS.md before reusing.
- The equity curve in THE DESK is a normalized backtest illustration and is
  labeled as such; keep the "backtest, not live performance" honesty rule.

## Deployment

Live at https://shrianshjena.vercel.app from the GitHub repo
`shrianshjena/Shri-Portfolio-Website`; pushes to `main` auto-deploy, so push
only after a green local build and E2E.
Env vars on Vercel: `NEXT_PUBLIC_WEB3FORMS_KEY`, `NEXT_PUBLIC_SITE_URL`
(both have working fallbacks baked in). When the jenas.in domain is
connected, set `NEXT_PUBLIC_SITE_URL=https://jenas.in` on Vercel and
redeploy; every canonical/OG/sitemap/JSON-LD URL follows.
