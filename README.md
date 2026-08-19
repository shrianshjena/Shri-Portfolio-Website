# EDGE IS ENGINEERED — Shriansh Jena

Single-page portfolio repositioning Shriansh Jena around capital markets, fintech and
AI-augmented engineering: options trader building the research, backtesting
and alerting systems behind the trades.

Live (after deploy): https://shrianshjena.vercel.app · Replaces: https://shrianshjena.lovable.app

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript strict |
| Styling | Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) |
| Motion | GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, DrawSVG) + Lenis smooth scroll |
| 3D | Spline robot scene, lazy-mounted with a poster-first fallback |
| Forms | Web3Forms, browser-side submission (vendor free-tier model) |
| Fonts | General Sans (Fontshare) + JetBrains Mono, self-hosted via `next/font/local` |

The site is fully static: one route, no API endpoints, no database.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill NEXT_PUBLIC_WEB3FORMS_KEY
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build (local dist dir rotates; Vercel uses .next)
```

Node 20.9+ required (`.nvmrc` pins 24).

## Project map

```
src/
  content/        types.ts + site.ts — the single typed source of ALL copy
  lib/            gsap.ts (only gsap import point), motion.ts (tiers/eases),
                  constants.ts, fonts.ts, cn.ts, loading-tracker.ts, contact-schema.ts
  components/
    providers/    SmoothScrollProvider (single RAF loop), LoadingProvider, AudioProvider
    preloader/    boot-sequence gate with a real-progress 0-100 counter
    nav/          fixed bar + accessible mobile overlay + audio toggle
    hero/         headline + lazy Spline island (poster-first) + music CTA
    sections/     one component per chapter (02-09), Footer + footer/ islands
                  (entrance motion, IST desk clock, page-floor mailto decode)
    fx/           ScrambleText, Decode, TickerMarquee, EquityCurve, CountUp,
                  CustomCursor, MagneticButton, GrainOverlay
    ui/           SectionShell, SectionHeading, Badge, ArrowLink, RailHeader
scripts/          one-off asset generators (icons, image optimization,
                  stack-logo vendoring, OG card screenshot)
```

Rules that keep the codebase coherent:

- Import gsap only from `@/lib/gsap`; one RAF loop (GSAP ticker drives Lenis).
- Every animated component implements three tiers via `gsap.matchMedia`
  (`MEDIA.full` / `MEDIA.lite` / `MEDIA.reduce` from `src/lib/motion.ts`).
- Scroll-driven transforms own wrapper elements; pointer effects own inner
  elements; CSS transitions never touch a GSAP-driven property.
- All copy lives in `src/content/site.ts`; components receive slices as props.

See DESIGN_SYSTEM.md for the visual language, SECURITY.md for the security posture,
CHANGELOG.md for history, CREDITS.md for third-party attribution.

## Deployment

Vercel, framework preset auto-detected. Environment variables:

- `NEXT_PUBLIC_WEB3FORMS_KEY` — public Web3Forms form identifier
- `NEXT_PUBLIC_SITE_URL` — canonical URL for metadata/sitemap/JSON-LD.
  When the jenas.in domain is connected, set this to `https://jenas.in` on
  Vercel and redeploy; every canonical/OG/sitemap/JSON-LD URL follows.

Local build output goes to a rotating dist dir (currently `.dist4`); Vercel
builds into the standard `.next` (see the note in `next.config.ts`: on this
development machine an editor's file-watcher on exFAT locks previously used
dist directories; `.vscode/settings.json` excludes them from watching).
