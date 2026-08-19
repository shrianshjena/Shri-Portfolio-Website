/* Named constants — no magic numbers inside components. */

/* Spline hero scene (public URL from the Spline integration guide). */
export const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/* Preloader timing. The 9s minimum is a deliberate reading hold for the
 * Tom Brady quote (first visit only; session revisits and reduced motion
 * skip it entirely). */
export const PRELOADER_MIN_MS = 9000;
export const PRELOADER_CAP_MS = 9000;
export const PRELOADER_TASK_TIMEOUT_MS = 2000;
export const PRELOADER_SESSION_KEY = "sj:preloaded";
export const PRELOADER_QUOTE_FADE_IN_MS = 1000;
export const PRELOADER_QUOTE_FADE_OUT_AT_MS = 8500;
/* Real asset progress is capped here so the counter never idles at 99 while
 * the quote hold runs; the time-based drift carries the remainder. */
export const PRELOADER_REAL_PROGRESS_CEIL = 60;

/* Spline mount gate. */
export const MIN_DEVICE_MEMORY_GB = 4;
export const SPLINE_IDLE_VISIBILITY = 0.05;

/* Audio. */
export const AUDIO_TARGET_VOLUME = 0.55;
export const AUDIO_FADE_S = 0.8;

/* Ticker marquee: constant-speed loop, never scroll-coupled. */
export const TICKER_LOOP_S = 48;

/* Spiral helix (projects). */
export const HELIX_ARM_ANGLES = [0, 45, 90, 135, 180] as const;
export const HELIX_RADIUS_PX = 340;
export const HELIX_ARM_RISE_PX = 110;

/* Pointer fx. */
export const MAGNET_STRENGTH = 0.35;
export const MAGNET_LABEL_STRENGTH = 0.12;
export const CURSOR_RING_LERP_S = 0.4;

/* Autonomous dial (The Loop). Continuous spin; detent dwell derives from
 * spin duration / detent count. */
export const DIAL_SPIN_S = 48;
export const DIAL_SPIN_LITE_S = 90;

/* Decode (log-entry) reveal. Duration = clamp(min, chars * per-char, max). */
export const DECODE_CHAR_S = 0.02;
export const DECODE_MIN_S = 0.6;
export const DECODE_MAX_S = 1.6;

/* Stack section scroll-rotation tiles. */
export const STACK_TILE_TILT_DEG = 8;
export const STACK_TILE_DRIFT_PX = 24;

/* NSE cash session, minutes from midnight IST (09:15-15:30, Mon-Fri). */
export const NSE_OPEN_MIN = 555;
export const NSE_CLOSE_MIN = 930;

/* Canonical site URL (overridden by NEXT_PUBLIC_SITE_URL). */
export const FALLBACK_SITE_URL = "https://shrianshjena.vercel.app";
