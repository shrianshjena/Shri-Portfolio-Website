# Changelog

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
