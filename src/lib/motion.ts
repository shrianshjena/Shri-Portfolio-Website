/*
 * Motion system constants shared by every animated component.
 *
 * Tiers (used with gsap.matchMedia): every animated component implements all
 * three branches. full = pins/scrubs/scrambles; lite = simple reveals, no
 * pins; reduce = final states set instantly, native scroll, no Spline.
 */
export const MEDIA = {
  full: "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  lite: "(prefers-reduced-motion: no-preference) and ((pointer: coarse) or (max-width: 1023px))",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

/* One easing vocabulary: slow decelerating reveals, no bounce. */
export const EASE = {
  out: "power3.out",
  inOut: "power4.inOut",
  soft: "power2.out",
  elastic: "elastic.out(1, 0.35)",
  none: "none",
} as const;

/* Durations in seconds. */
export const DUR = {
  fast: 0.45,
  base: 0.9,
  slow: 1.6,
} as const;

/* Character pool for the holographic scramble/decrypt aesthetic. */
export const SCRAMBLE_CHARS = "01<>/\\#_[]{}=+*";

/* Stagger between line reveals in seconds. */
export const LINE_STAGGER = 0.08;
