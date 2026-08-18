# Security

## Reporting

Report vulnerabilities privately to shriansh.jena05@gmail.com. Do not open
public issues for security matters.

## Attack surface

The site is fully static: one prerendered route, no API endpoints, no
database, no authentication, no cookies, no analytics. The only dynamic
behaviors are client-side (GSAP animation, the Spline 3D scene, the audio
player) and one outbound form submission.

## Controls in place

- **Security headers** (`next.config.ts`): Content-Security-Policy, HSTS
  (preload), X-Content-Type-Options nosniff, X-Frame-Options DENY /
  frame-ancestors 'none', Referrer-Policy strict-origin-when-cross-origin,
  Permissions-Policy (camera/mic/geolocation/payment/usb denied),
  Cross-Origin-Opener-Policy same-origin. `X-Powered-By` disabled.
- **CSP allowlist**: only self plus `prod.spline.design` (3D scene fetch),
  `unpkg.com` (Spline runtime decoder assets) and `api.web3forms.com`
  (form submission) in `connect-src`; `wasm-unsafe-eval` and blob workers for
  the Spline runtime; everything else self-hosted.
- **No production source maps**; `console.*` stripped except `console.error`.
- **JSON-LD** is serialized with `<` escaped so no content string can close
  the script element.
- **Contact form**: schema-validated with zod (`.strictObject`, length
  limits) before submission; a hidden honeypot field short-circuits bots
  locally without any network request.

## Documented tradeoffs

- **CSP `script-src 'unsafe-inline'`**: required by Next.js's inline bootstrap
  on a static page without nonce plumbing. Upgrade path: nonce-based
  `strict-dynamic` via middleware if the site ever gains dynamic routes.
- **Web3Forms access key is public by design.** The vendor's free tier only
  accepts browser-side submissions; the key is a form identifier that can
  only route mail to the owner's inbox. Abuse is bounded by Web3Forms' own
  bot protection (Cloudflare) plus the honeypot. There is no server relay
  and therefore no server rate limiter; if spam ever becomes a problem,
  enable hCaptcha in the Web3Forms dashboard (supported on the free tier).
- **Public contact details** (email, phone) are published deliberately as
  part of the portfolio's contact chapter and JSON-LD.

## Supply chain

Dependencies are minimal (gsap, @gsap/react, lenis, @splinetool/react-spline,
@splinetool/runtime, zod, next, react). `npm audit` reported zero
vulnerabilities at build time. Fonts, images and audio are self-hosted; the
only third-party runtime fetches are the Spline scene and its decoders.
