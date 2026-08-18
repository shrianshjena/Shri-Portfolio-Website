/* Named constants — no magic numbers inside components. */

/* Spline hero scene (public URL from the Spline integration guide). */
export const SPLINE_SCENE_URL =
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

/* Preloader timing. */
export const PRELOADER_MIN_MS = 1400;
export const PRELOADER_CAP_MS = 2500;
export const PRELOADER_TASK_TIMEOUT_MS = 2000;
export const PRELOADER_SESSION_KEY = "sj:preloaded";

/* Spline mount gate. */
export const MIN_DEVICE_MEMORY_GB = 4;
export const SPLINE_IDLE_VISIBILITY = 0.05;

/* Audio. */
export const AUDIO_TARGET_VOLUME = 0.55;
export const AUDIO_FADE_S = 0.8;
export const AUDIO_PREF_KEY = "sj:audio";

/* Ticker marquee. */
export const TICKER_LOOP_S = 28;
export const TICKER_MAX_SPEED = 6;
export const TICKER_VELOCITY_DIVISOR = 250;

/* Spiral helix (projects). */
export const HELIX_ARM_ANGLES = [0, 45, 90, 135, 180] as const;
export const HELIX_RADIUS_PX = 340;
export const HELIX_ARM_RISE_PX = 110;

/* Pointer fx. */
export const MAGNET_STRENGTH = 0.35;
export const MAGNET_LABEL_STRENGTH = 0.12;
export const CURSOR_RING_LERP_S = 0.4;

/* Scroll-rotation dial (The Loop). */
export const DIAL_MAX_ROTATION_DEG = 360;

/* Canonical site URL (overridden by NEXT_PUBLIC_SITE_URL). */
export const FALLBACK_SITE_URL = "https://shrianshjena.vercel.app";
