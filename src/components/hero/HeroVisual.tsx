"use client";

import Image from "next/image";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLoading } from "@/components/providers/LoadingProvider";
import { SplineErrorBoundary } from "./SplineErrorBoundary";
import { MIN_DEVICE_MEMORY_GB } from "@/lib/constants";
import { MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";

/*
 * Poster-first hero visual. The poster is the LCP element; the Spline
 * runtime chunk mounts only when ALL gates pass: full motion tier (desktop,
 * fine pointer, no reduced motion), enough device memory, hero in view, and
 * preloader finished. On load the canvas crossfades over the poster, which
 * stays mounted underneath as the instant fallback.
 */
const LazySplineScene = lazy(() => import("./SplineScene"));

const HERO_POSTER_SRC = "/images/hero-poster.webp";

interface HeroVisualProps {
  readonly posterAlt: string;
}

export function HeroVisual({ posterAlt }: HeroVisualProps) {
  const { status } = useLoading();
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tierOk, setTierOk] = useState(false);
  const [splineReady, setSplineReady] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);

  useEffect(() => {
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    setTierOk(
      window.matchMedia(MEDIA.full).matches && memory >= MIN_DEVICE_MEMORY_GB,
    );

    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const mountSpline = tierOk && inView && status === "done";

  return (
    <div ref={hostRef} className="relative h-full w-full">
      <Image
        src={HERO_POSTER_SRC}
        alt={posterAlt}
        fill
        priority
        fetchPriority="high"
        sizes="(max-width: 1023px) 100vw, 45vw"
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
              <LazySplineScene onReady={() => setSplineReady(true)} />
            </div>
          </Suspense>
        </SplineErrorBoundary>
      ) : null}
    </div>
  );
}
