# Changelog

## 1.3.0 — 2026-08-20

Regression repair round.

### Fixed

- IN PRODUCTION spiral overlapping earlier sections (v1.2 regression): the
  helix pin's refreshPriority made it refresh BEFORE the Desk pin —
  ScrollTrigger sorts by (-1e6 x priority) + document position — so it
  measured its start with the Desk's pin spacer reverted and pinned
  viewports early, covering THE RECORD. Pins now form a priority ladder
  (Desk 2, helix 1, everything else 0 in document order) and the redundant
  manual sort/refresh calls are removed.
- Share-preview description still read "NIFTY 50 options trader": the v1.2
  meta.description edit was consumed by a tooling gate and never retried.
  Now applied; WhatsApp may serve its cached unfurl until the per-URL
  cache expires (test with a fresh query string).
- Ticker marquee rebuilt as a pure-CSS compositor animation per the SOLAS
  MODU performance reference: keyframes plus animation-play-state pausing
  plus an IntersectionObserver offscreen gate replace the GSAP loop
  entirely, removing main-thread jank and the killable-tween hazard its
  post-mortem documents.

### Changed

- SOLAS MODU record image is now the offshore crew-transfer photograph;
  the WoodsMan row returns to text-only.
- Record ledger images enter with a calm fade-settle (opacity plus a 1.04
  scale, delayed behind the decode cascade) instead of the clip-path wipe.

## 1.2.0 — 2026-08-19

Review round 2: broader trading identity, the desktop trigger-timing root
cause, a calmer ticker, the robot on mobile, and an imagery pass.

### Fixed

- Desktop scroll-trigger timing below chapter 05: GSAP refreshes triggers
  in creation order and only document-sorts when some trigger declares
  refreshPriority. The helix pin mounts after first paint (grid-to-helix
  swap), so every refresh measured Stack/Foundations/Contact with its 250%
  pin spacer reverted and their once-triggers fired ~2.5 viewports early;
  the dial's park window landed inside the helix, pausing the spin whenever
  scrolling rested on the real dial. Fix: refreshPriority on the helix pin
  (turns the global sort on) plus an explicit sort+refresh after the pin
  mounts, and an onRefresh resync on the dial park trigger.
- Ticker marquee: scroll-velocity coupling removed entirely (it allocated a
  timeScale tween on nearly every scroll frame, the lag source). The tape
  is now a constant-speed, fully auto-driven loop, slowed 28s to 48s per
  cycle, GPU-promoted (force3D + will-change). Hover-pause and HOLD stay.

### Changed

- Identity wording broadened from "NIFTY options trader" to options trader
  in the hero subtitle, meta/share description, keywords, the Position
  opener and the RESEARCH detent. The backtest-engine panel and the ticker
  instruments entry keep NIFTY 50 as system facts (owner decision).
- Spline robot now mounts on the lite tier too (phones and small screens,
  deviceMemory >= 4, never reduced-motion), with the HOLD control along;
  the mobile hero was a static poster before.
- Hero music CTA sits in flow below the visual on mobile (no robot
  overlap); the md+ three-zone bottom bar is unchanged.
- Imagery: Position portrait is now the rain-at-the-vessel-rail frame; the
  SOLAS MODU entry shows a cropped solasmodu.net screenshot instead of the
  portrait; the photo band is the SOLAS MODU freefall-lifeboat deployment;
  WoodsMan gains a 3:4 BI-dashboard image. The optimizer script gained an
  optional crop step for the screenshot trim.
- SOLAS MODU line: GAIL (Gas Authority of India Limited) replaces the
  American Bureau of Shipping.

## 1.1.0 — 2026-08-19

User-review round: identity assets and share cards, the previous site's
preloader quote, imagery through every chapter, a new tech-stack chapter and
a motion pass over the quieter sections.

### Added

- SJ monogram identity: favicon, app and apple-touch icons, web manifest,
  theme color, and a static 1200x630 Open Graph / Twitter share card
  generated from the design tokens (`scripts/generate-og.mjs`).
- Preloader quote: the Tom Brady quote from the previous site on a 9-second
  first-visit reading hold, with content-driven boot lines (no tooling
  named), a SKIP control plus Enter/Escape dismissal (WCAG 2.2.1), inert
  focus containment behind the overlay, and an idempotent early finish.
- New chapter 07 THE STACK: 29 locally vendored tool marks in three hairline
  bands (ANALYSIS / BUILD & SHIP / AI SYSTEMS) settling from an alternating
  tilt in a scrubbed scroll-rotation. Foundations and Contact renumbered
  08/09; nav and the footer index follow.
- Decode text system (`fx/Decode.tsx`), the SOLAS MODU log-entry port: copy
  resolves left-to-right out of a glyph scramble, with reserveLayout for
  zero-CLS multi-line body. Applied to Position paragraphs, Record lines and
  bullets, contact copy and the footer signoff. RailHeader instrument device
  for column and band headers.
- Imagery: Position portrait (3:4), Record entry images for Al's & Jo's,
  Deepsea Finvest and SOLAS MODU (3:4 vessel-rail portrait), a jack-up-rig
  field-record band, analytics archive thumbnails, and the CARLTSOLAS drone
  frame.
- Hero music CTA at bottom center (THIS EXPERIENCE IS BETTER WITH MUSIC)
  wired to the existing audio provider, with a bounded breathing loop.
- Footer as a closing instrument panel: live IST desk clock with an NSE
  open/closed session line, the full 01-09 chapter index, ALL RIGHTS
  RESERVED and BUILT BY SHRIANSH JENA lines, and a page-floor decode on the
  giant mailto.

### Changed

- Spline robot: `renderOnDemand` removed so the scene's autonomous facial
  and blink animation actually plays; canvas enlarged to a 48 percent
  column at 82svh with a recut poster; run state unified so offscreen,
  hidden-tab and user HOLD all converge on one stop/play decision, and the
  scene warms up behind the preloader hold.
- The Loop dial rotates continuously (48s/90s per revolution) with timed
  detent cycling, an always-readable detent list and a HOLD/RUN control;
  skill columns cascade per item under RailHeader headers beside a scrubbed
  sounding line.
- Copy: DOWNLOAD CV became DOWNLOAD RESUME; "private wealth" became
  "private wealth management"; SOLAS MODU serves ONGC, the American Bureau
  of Shipping (ABS), Indian Oil and Mazagon Dock and links solasmodu.net
  first; loop detent descriptions carry desk specifics.
- Foundations: all three education numbers count up at the same display
  scale; 8.6 CGPA keeps the section's single accent moment.
- Contact: DESK OPEN status rail, decoded copy, per-field entrance stagger,
  CSS-only focus underlines, scrambled submit and success states. The
  Web3Forms submit flow is byte-identical.
- Footer telemetry no longer names the site's own build tools.

### Fixed (adversarially verified review round, 16 findings)

- Spline power management: the render loop can no longer keep running
  offscreen after a late scene load or a tab return while scrolled away.
- WCAG mechanisms for every new autonomous motion: dial HOLD, hero 3D HOLD,
  pulse loops bounded under one 5-second cycle, breathe trough raised to AA
  contrast, timed-quote SKIP, inert page shell behind the preloader.
- CountUp exposes a stable screen-reader value (sr-only final + aria-hidden
  animated twin); Decode never replays across motion-tier changes;
  preloader teardown and SSR quote flash fixed; `media-src data:` admits
  the Spline runtime's codec probe.
- Documented tradeoffs: per-element decode ScrollTriggers (once-only and
  self-killing on a single static page) and the per-second footer clock
  (live-clock essential exception, recorded in code).

## 1.0.0 — 2026-08-18

Ground-up rebuild of shrianshjena.lovable.app, repositioning the portfolio
around capital markets, fintech and AI-augmented engineering.

### Added

- Eight-chapter single-page narrative: hero (EDGE IS ENGINEERED, Spline robot),
  ticker band, THE POSITION (rewritten About), THE DESK (horizontal pinned
  chapter with a scroll-drawn backtest equity curve), THE RECORD (employment
  ledger with the vessel-deck photo band), IN PRODUCTION (3D helix of live
  platforms plus an analytics archive), THE LOOP (scroll-rotation instrument
  dial and skills telemetry), FOUNDATIONS, THE MARKET IS OPEN (contact) and a
  utility footer.
- Boot-sequence preloader with a real-progress 0-100 counter (fonts, hero
  poster, first frame), 2.5s hard cap, session skip and a scramble +
  clip-path exit handing off to the hero reveal.
- Holographic scramble/scanline text system applied to all chapter headings
  and the hero (GSAP ScrambleTextPlugin, translucent steel resolving to
  white), with real sr-only copy for assistive tech.
- Three-track ambient audio player (carried over from the old site) with a
  mono track readout, play/pause in the nav and gesture-only playback.
- Three-tier motion system (full / lite / reduce) in every animated component
  via gsap.matchMedia; reduced motion gets a fully static, complete page.
- Typed content model (`src/content/site.ts`) holding every word of copy,
  rebuilt from the July 2026 resume and CV.
- Security headers + CSP, JSON-LD Person schema, sitemap, robots, OG metadata.
- Custom cursor, magnetic CTAs, static film grain, scroll-velocity ticker
  with an accessible HOLD/RUN control.

### Changed

- Positioning: "CREATIVE ENGINEER" generalist framing replaced by derivatives
  trader + systems builder; About rewritten entirely; experience and projects
  restructured into private desk systems (Deepsea Finvest) versus live public
  platforms; CARLTSOLAS links point at the Vercel deployment while the custom
  domain is parked.
- Contact form now submits to Web3Forms from the browser (vendor free-tier
  model) with zod validation and a local honeypot short-circuit.
- Stack: Vite + framer-motion + React Three Fiber replaced by Next.js 16 +
  GSAP + Lenis + lazy Spline with a poster-first hero (static LCP element).

### Removed

- Unskippable 10.5s intro quote overlay, neon-cyan glow styling, system-font
  typography, external icon CDN dependency, Lovable badge and metadata, the
  exposed-in-bundle Web3Forms usage pattern of the old SPA (the key is now
  documented as the public identifier it is), Early Sepsis healthcare framing
  in the hero positioning (retained as an archive row).

### Fixed (post-review hardening, adversarially verified)

- Mobile menu is a real dialog: focus trap, Escape, scroll lock, focus return.
- Ticker: WCAG 2.2.2 pause control; keyboard-scrollable strip; hover-pause race.
- AA contrast for education detail values; count-ups fire on true visibility
  inside the pinned Desk track; preloader counter follows real progress;
  no-JS visitors see the full page (noscript hides the gate); Spline island
  unmounts when the motion tier drops; JSON-LD escaped; SSR/client hydration
  determinism for the dial's SVG ticks.
