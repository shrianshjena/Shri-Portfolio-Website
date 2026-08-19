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

Autonomous motion carries its own mechanism: anything moving longer than 5
seconds ships a HOLD/RUN control (ticker, dial, hero 3D scene), attention
pulses are bounded to a single sub-5s cycle (WCAG 2.2.2), and the per-second
footer clock claims the live-clock essential exception (recorded in code).

Signature set-pieces, each used exactly once:

- **Preloader** (00): 0-100 tabular counter driven by the monotonic max of a
  time drift and real asset progress (fonts, hero poster, first frame),
  holding 9s on first visit for the Tom Brady quote with a SKIP control and
  Enter/Escape dismissal; session revisits and reduced motion exit instantly;
  exits with a scramble + clip-path wipe.
- **Scramble text**: ScrambleTextPlugin reveal with a scanline sweeping down
  and color resolving from translucent steel to the element's color. All
  chapter eyebrows/headings (on enter) and the hero (on preloader handoff).
  Accessible copy is a real sr-only text node.
- **Decode (log entry)**: the second text system, ported from the SOLAS MODU
  build. Copy resolves left-to-right out of a glyph scramble; multi-line body
  uses reserveLayout (invisible sizer plus absolute overlay at constant string
  length, zero CLS). Position paragraphs, Record lines and bullets, contact
  copy, footer signoff. Page-floor consumers pass `start="top bottom"`.
- **RailHeader**: instrument column/band header. A ring dot that fills on
  entry, a decoded mono label, and a hairline running to the container edge
  with a terminal tick. Loop skill groups, Stack bands, Foundations columns.
- **Ticker** (between 01 and 02): the site's only marquee; scroll-velocity
  coupled on desktop, plain autoplay on touch, static and swipeable under
  reduced motion; visible HOLD/RUN pause control (WCAG 2.2.2).
- **Horizontal pinned chapter** (03 THE DESK): vertical scroll drives lateral
  panel traversal while the backtest equity curve draws (DrawSVG) across the
  full track in the same scrubbed timeline; scroll position is the backtest
  timeline.
- **Photo band** (04): an offshore jack-up-rig frame as a 45vh duotone band,
  8 percent parallax, environmental crop, mono caption. Deliberately not a
  portrait; the 3:4 vessel-rail portrait lives inside the SOLAS MODU ledger
  row instead.
- **Spiral helix** (05): four live platforms on a rotating 3D ring (pinned,
  scrubbed 360 degrees, cosine opacity falloff). The accessible grid variant
  stays in the DOM; keyboard focus reveals it as a visible panel.
- **Instrument dial** (06): tick-ring spinning autonomously (48s full / 90s
  lite per revolution) with timed detent cycling through RESEARCH, BUILD,
  BACKTEST, DEPLOY, REVIEW; every detent description stays readable, a
  HOLD/RUN control pauses the motion, and the spin parks offscreen.
- **Stack tile wall** (07): 29 monochrome tool marks in three hairline bands;
  tiles settle from an alternating 8-degree tilt with a small drift in a
  scrubbed scroll-rotation as each band transits the viewport.
- **Custom cursor / magnetic buttons / grain**: fine-pointer only; grain is a
  static SVG turbulence tile at 5 percent.

Easing vocabulary: decelerating power curves, no bounce or springs
(`EASE.out = power3.out`, `EASE.inOut = power4.inOut`, elastic reserved for
magnetic release).

## Layout

- One idea per viewport; section rhythm `py-28 md:py-40`; gutters
  `px-6 md:px-12 lg:px-20`.
- Chapters are numbered 01-09 with mono eyebrows
  (`03 · PRIVATE BUILDS / DEEPSEA FINVEST`); 07 is THE STACK.
- Nav: fixed 56px, hairline bottom border, raw navy, three zones
  (ident / anchors / audio module). Mobile menu is a full-screen dialog with a
  real focus trap.
- Footer: giant mailto with a page-floor decode and hover re-decode, three
  mono columns (CHANNELS with GitHub first, the full 01-09 INDEX, DESK STATUS
  with a live IST clock and NSE session line), rights and BUILT BY lines,
  chess-motif signoff `YOU VS YOU · EVERY SESSION`.
