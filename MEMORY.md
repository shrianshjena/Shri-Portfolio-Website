# Project Memory

Running log of decisions and state that the code alone does not explain.
Newest first.

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
