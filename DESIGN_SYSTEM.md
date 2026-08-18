# Design System

Dark-only, Bugatti-derived luxury-precision language for a capital-markets identity.
The axiom every chapter serves: trader first, engineer because the edge demanded it.

## Palette (navy ramp, luminance-step elevation)

| Token | Value | Role |
|---|---|---|
| `canvas` | `#050A16` | Page floor |
| `ink` | `#081020` | Soft surface (panels, cards) |
| `ink-2` | `#082030` | Raised surface, photo duotone |
| `line` | `rgba(240,240,248,0.08)` | Hairline borders and dividers |
| `line-strong` | `rgba(240,240,248,0.16)` | Input underlines, emphasized rules |
| `fg` | `#F0F0F8` | Primary text |
| `muted` | `#8090A0` | Body copy, secondary text |
| `steel` | `#78B0F0` | Metadata, eyebrows, readable blue (AA at small sizes) |
| `accent` | `#1D5BD8` | Electric blue: graphic elements, large display numbers, the progress bar. At body sizes it fails AA on the canvas, so small text uses `steel` instead |
| `amber` | `#E8622C` | Rare emphasis only. Site-wide budget: the bonds alert pulse, one ticker delta, the compliance badge |

Elevation is expressed only by luminance steps and hairlines. No box shadows, no
gradients (the photo-caption scrim is the single exception), no glassmorphism,
no rounded corners except the contact pill CTA and tiny status-light dots.

## Typography

- **General Sans** (variable, self-hosted): all display and body text. Weight 400
  everywhere; emphasis comes from scale, case and tracking, never boldness.
- **JetBrains Mono**: every label, eyebrow, caption, number. Uppercase, wide
  tracking (0.18-0.28em), `tabular-nums`.
- Utilities in `globals.css`: `display-hero` (clamp 2.75rem-8.5rem, sized to fit
  the hero's text column beside the 3D scene), `display-heading` (clamp
  2.25rem-6rem), `eyebrow`, `mono-nums`.
- Line-height on display type: 0.98-1.02. Headlines six words or fewer.

## Copy voice

1. Every claim carries a number or names a system; otherwise it is cut.
2. Trading-desk register: backtested, deployed, screened, shipped. Banned:
   passionate, innovative, empowering, journey, crafting.
3. Backtests are always labeled backtests; the ticker is captioned
   "STATIC RECORD ... NOT A LIVE FEED".
4. No em dashes, no exclamation marks.

## Motion system

Engine: GSAP only (one registration point, `src/lib/gsap.ts`), Lenis for scroll
smoothing, one RAF loop (GSAP ticker drives `lenis.raf`). Never two engines on
one property: scroll scrubs animate wrapper elements, pointer effects animate
inner elements, CSS transitions stay off GSAP-driven properties.

Three tiers, implemented in every animated component via `gsap.matchMedia`:

| Tier | Query (`src/lib/motion.ts`) | Behavior |
|---|---|---|
| `full` | ≥1024px, fine pointer, no reduced-motion | Pins, scrubs, scrambles, Spline |
| `lite` | touch or <1024px, no reduced-motion | Fades and rises only; horizontal chapters become native swipe strips; helix becomes a grid |
| `reduce` | `prefers-reduced-motion` | Final states set instantly; native scroll; Spline never mounts; poster only |

Signature set-pieces, each used exactly once:

- **Preloader** (00): 0-100 tabular counter driven by the monotonic max of a
  time drift and real asset progress (fonts, hero poster, first frame), capped
  at 2.5s, session-skipped on revisit, exits with a scramble + clip-path wipe.
- **Scramble text**: ScrambleTextPlugin reveal with a scanline sweeping down
  and color resolving from translucent steel to the element's color. All
  chapter eyebrows/headings (on enter) and the hero (on preloader handoff).
  Accessible copy is a real sr-only text node.
- **Ticker** (between 01 and 02): the site's only marquee; scroll-velocity
  coupled on desktop, plain autoplay on touch, static and swipeable under
  reduced motion; visible HOLD/RUN pause control (WCAG 2.2.2).
- **Horizontal pinned chapter** (03 THE DESK): vertical scroll drives lateral
  panel traversal while the backtest equity curve draws (DrawSVG) across the
  full track in the same scrubbed timeline; scroll position is the backtest
  timeline.
- **Photo band** (04): the vessel-deck photograph as a 45vh duotone band,
  8 percent parallax, environmental crop, mono caption. Deliberately not a
  portrait.
- **Spiral helix** (05): four live platforms on a rotating 3D ring (pinned,
  scrubbed 360 degrees, cosine opacity falloff). The accessible grid variant
  stays in the DOM; keyboard focus reveals it as a visible panel.
- **Instrument dial** (06): tick-ring rotation scrubbed by scroll through five
  detents (RESEARCH, BUILD, BACKTEST, DEPLOY, REVIEW).
- **Custom cursor / magnetic buttons / grain**: fine-pointer only; grain is a
  static SVG turbulence tile at 5 percent.

Easing vocabulary: decelerating power curves, no bounce or springs
(`EASE.out = power3.out`, `EASE.inOut = power4.inOut`, elastic reserved for
magnetic release).

## Layout

- One idea per viewport; section rhythm `py-28 md:py-40`; gutters
  `px-6 md:px-12 lg:px-20`.
- Chapters are numbered 01-08 with mono eyebrows
  (`03 · PRIVATE BUILDS / DEEPSEA FINVEST`).
- Nav: fixed 56px, hairline bottom border, raw navy, three zones
  (ident / anchors / audio module). Mobile menu is a full-screen dialog with a
  real focus trap.
- Footer: giant mailto, three mono columns (CHANNELS with GitHub first, INDEX,
  TELEMETRY), chess-motif signoff `YOU VS YOU · EVERY SESSION`.
