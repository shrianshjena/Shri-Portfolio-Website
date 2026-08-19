# Project Memory

Running log of decisions and state that the code alone does not explain.
Newest first.

## 2026-08-19 · v1.1.0 shipped (commit f1db97f, live on Vercel)

- **What shipped**: user-review round per the v1.1 brief. SJ favicon/app
  icons/manifest/OG-Twitter share card; 9s Tom Brady preloader quote (first
  visit only, SKIP + Enter/Escape dismiss); Spline `renderOnDemand` removed
  (that prop froze the robot's autonomous blink/facial animation, the
  reported bug) and the canvas enlarged to 48%/82svh with a recut poster;
  bottom-center music CTA; Decode (SOLAS MODU log-entry port) applied to
  Position/Record/Contact/footer copy; imagery in Position/Record/archive;
  new 07 THE STACK scroll-rotation chapter (Foundations→08, Contact→09);
  autonomous dial with HOLD; Foundations equal-scale count-ups; contact
  motion pass; footer desk clock (IST + NSE session) with full index and
  rights/credit lines. Copy: DOWNLOAD RESUME, private wealth management,
  ABS replaces Reliance, solasmodu.net primary.
- **Decisions**: 9s hold is first-visit-per-session only (user choice);
  canonical URL stays env-driven until jenas.in DNS lands (user choice);
  stack list curated to 29 (dropped Stripe/Shopify/ByteDance, user choice);
  soundtrack stays 3 tracks (user choice). No Next.js/GSAP/Spline tiles in
  THE STACK: the no-tech-mentions rule covers the site's own build tools
  (preloader boot lines and footer telemetry cleaned accordingly), while
  Claude Code/MCP stay in LOOP copy as professional identity. LOOP text
  skills deliberately overlap STACK logos (competencies vs instruments).
- **Review round**: 3-lens adversarial workflow, 16 verified findings; 14
  fixed (Spline offscreen render leaks, WCAG 2.2.1 skip, 2.2.2 HOLD
  controls and bounded pulses, inert page shell behind the preloader,
  CountUp sr values, Decode tier-flip replay, SSR quote flash, teardown),
  2 documented tradeoffs: ~54 per-element Decode ScrollTriggers (once-only,
  self-killing, acceptable on a single static page; batch via a parent
  trigger if refresh cost ever grows) and the per-second footer clock
  (live-clock essential exception, recorded in DeskClock.tsx).
- **Environment learnings**: the Antigravity IDE latches onto every newly
  created dist dir until restarted; rotated .dist→.dist2→.dist3→.dist4 in
  one working day. agent-browser hangs on this machine even attached over
  CDP; the reliable driver is puppeteer-core connected to a hand-launched
  SwiftShader Chrome (scripts in the session scratchpad). SwiftShader
  compiles the Spline scene for minutes at desktop viewports: screenshots
  time out mid-compile and the headline can be caught mid-scramble; both
  are rig artifacts, not site bugs. Spline's runtime probes codec support
  with a data: video, so CSP media-src needs `data:`.
- **Verification**: local E2E (23 shots, 390/768/1440 + reduce), blink
  check (two canvas frames 3s apart differ = scene animating), live E2E on
  shrianshjena.vercel.app (head tags, all asset routes 200, updated CSP,
  console clean), share-card head verified server-side.
- **Open follow-ups**: user tests the contact form once from a real browser
  on production (Cloudflare blocks automation); user shares the URL on
  WhatsApp to confirm the OG card renders; user rotates the GitHub PAT
  after final approval; jenas.in DNS + `NEXT_PUBLIC_SITE_URL` flip;
  carltsolas.com still parked; licensed-audio question stands (public repo,
  see CREDITS.md).

## 2026-08-18 · v1.0.0 built, reviewed, awaiting deploy auth

- **State**: all eight chapters implemented and integrated; production build
  green; adversarial three-lens review (correctness, security, a11y/motion)
  run and all 18 verified findings fixed or explicitly documented as
  tradeoffs (SECURITY.md). E2E performed against the local production server
  and via headless Chrome (desktop 1440, mobile 390, reduced-motion).
- **Blocked on user**: GitHub push and Vercel deploy need one interactive
  login (`gh auth login` or `npx vercel login`); no valid credentials exist
  on this machine (the stored Vercel CLI token is expired).
- **Decisions taken during build**:
  - Hero headline is the positioning statement EDGE IS ENGINEERED (user chose
    over the name treatment); the name lives in eyebrow, nav and footer.
  - Projects are tiered: Deepsea Finvest private systems as the flagship
    horizontal chapter, four live platforms in the helix, analytics work
    (Uber/Zomato/Nike/Sepsis) in a compact archive band ("keep everything"
    per user, without diluting the finance-first positioning).
  - Contact moved from a server proxy to browser-side Web3Forms submission
    after discovering their free tier rejects server-to-server calls; the
    access key is public by vendor design.
  - CARLTSOLAS links to carltsolas-website.vercel.app: carltsolas.com is a
    parked GoDaddy domain (user should reconnect DNS).
  - The hero display scale was reduced (clamp 2.75rem-8.5rem) because the
    original 11vw scale's min-content width pushed the Spline column
    off-viewport in the hero grid.
- **Assets**: hero-poster.webp is a SwiftShader-rendered frame of the Spline
  scene captured at 2560px viewport; field-record.jpg is the compressed
  vessel photo (5.7MB PNG source stays outside the repo); Options Academy and
  CARLTSOLAS covers are live-site screenshots taken this session.
- **Environment learnings** (also in CLAUDE.md): exFAT + Antigravity IDE
  watcher locks dist dirs (rotate distDir + exclusions when it happens);
  dev-server stale-module serving after edits; SwiftShader flags needed for
  WebGL in headless Chrome; Web3Forms behind Cloudflare blocks automated
  form verification.
- **Open follow-ups**: deploy after user login; verify the contact form once
  from a real browser on the production URL; consider licensed audio
  replacements (CREDITS.md); reconnect carltsolas.com DNS; optionally enable
  hCaptcha on Web3Forms if spam appears.
