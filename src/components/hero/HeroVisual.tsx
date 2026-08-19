"use client";

import Image from "next/image";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { SplineErrorBoundary } from "./SplineErrorBoundary";
import { MIN_DEVICE_MEMORY_GB } from "@/lib/constants";
import { MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";

/*
 * Poster-first hero visual. The poster is the LCP element; the Spline
 * runtime chunk mounts only when ALL gates pass: full motion tier (desktop,
 * fine pointer, no reduced motion), enough device memory, and hero in view.
 * On load the canvas crossfades over the poster, which stays mounted
 * underneath as the instant fallback.
 */
const LazySplineScene = lazy(() => import("./SplineScene"));

const HERO_POSTER_SRC = "/images/hero-poster.webp";

interface HeroVisualProps {
  readonly posterAlt: string;
}

export function HeroVisual({ posterAlt }: HeroVisualProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tierOk, setTierOk] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  /* WCAG 2.2.2 user pause for the continuously animating robot. */
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    /* The scene mounts on full AND lite tiers (the robot animates on
     * mobile too, per owner request); MEDIA.lite already excludes reduced
     * motion, and the memory floor keeps low-end devices on the poster. */
    const fullQuery = window.matchMedia(MEDIA.full);
    const liteQuery = window.matchMedia(MEDIA.lite);
    const updateTier = (): void => {
      setTierOk(
        (fullQuery.matches || liteQuery.matches) &&
          memory >= MIN_DEVICE_MEMORY_GB,
      );
    };
    updateTier();
    fullQuery.addEventListener("change", updateTier);
    liteQuery.addEventListener("change", updateTier);

    const host = hostRef.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });
    if (host) observer.observe(host);
    return () => {
      fullQuery.removeEventListener("change", updateTier);
      liteQuery.removeEventListener("change", updateTier);
      observer.disconnect();
    };
  }, []);

  /* No preloader-status gate: the preloader holds for 9s behind an opaque
   * overlay that hides the hero, so mounting as soon as tier + viewport
   * allow makes that hold the Spline warm-up window. The robot must be
   * live before the curtain lifts, not start booting after it. */
  const mountSpline = tierOk && inView;

  /* If the tier drops (viewport narrows, reduced motion toggles on), the
   * Spline island unmounts; bring the poster back. */
  useEffect(() => {
    if (!mountSpline) setSplineReady(false);
  }, [mountSpline]);

  return (
    <div ref={hostRef} className="relative h-full w-full">
      {/* unoptimized: the poster is already a hand-tuned 21KB webp, and the
       * preloader decodes this exact URL, so the optimizer would only make
       * the page fetch the bytes twice under two different URLs. */}
      <Image
        src={HERO_POSTER_SRC}
        alt={posterAlt}
        fill
        priority
        unoptimized
        fetchPriority="high"
        sizes="(max-width: 1023px) 100vw, 48vw"
        onError={() => setPosterFailed(true)}
        className={cn(
          "object-contain transition-opacity duration-1000",
          (splineReady || posterFailed) && "opacity-0",
        )}
      />
      {mountSpline ? (
        <SplineErrorBoundary>
          <Suspense fallback={null}>
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                splineReady ? "opacity-100" : "opacity-0",
              )}
            >
              <LazySplineScene
                held={held}
                onReady={() => setSplineReady(true)}
              />
            </div>
          </Suspense>
        </SplineErrorBoundary>
      ) : null}
      {/* HOLD/RUN control (TickerMarquee vocabulary): user pause for the
       * robot's continuous idle animation, WCAG 2.2.2. Kept outside the
       * crossfade wrapper so it never sits under an aria-hidden ancestor;
       * hold wins over every automatic resume inside SplineScene. */}
      {mountSpline ? (
        <button
          type="button"
          onClick={() => setHeld((value) => !value)}
          aria-pressed={held}
          aria-label={held ? "Resume 3D scene" : "Pause 3D scene"}
          data-cursor="link"
          className="eyebrow pointer-events-auto absolute bottom-3 right-3 border border-line px-3 py-1.5 !text-[9px] text-steel transition-colors hover:border-line-strong motion-reduce:hidden"
        >
          {held ? "RUN ▸" : "HOLD ⏸"}
        </button>
      ) : null}
    </div>
  );
}
