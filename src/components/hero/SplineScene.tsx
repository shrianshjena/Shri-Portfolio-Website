"use client";

import { useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";
import { SPLINE_SCENE_URL, SPLINE_IDLE_VISIBILITY } from "@/lib/constants";

/*
 * Lazy-loaded Spline robot scene (the only 3D object on the site). The
 * runtime renders on demand; rendering is stopped entirely when the hero is
 * effectively offscreen or the tab is hidden, so idle CPU cost is zero.
 */
interface SplineSceneProps {
  readonly onReady?: () => void;
}

type PlayableApp = { stop?: () => void; play?: () => void };

export default function SplineScene({ onReady }: SplineSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const setRunning = (running: boolean): void => {
      const app = appRef.current as unknown as PlayableApp | null;
      if (!app) return;
      if (running) {
        app.play?.();
      } else {
        app.stop?.();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => setRunning(entry.intersectionRatio > SPLINE_IDLE_VISIBILITY),
      { threshold: [0, SPLINE_IDLE_VISIBILITY, 0.5] },
    );
    observer.observe(host);

    const onVisibility = (): void => setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={hostRef} className="h-full w-full">
      <Spline
        scene={SPLINE_SCENE_URL}
        renderOnDemand
        onLoad={(app: Application) => {
          appRef.current = app;
          onReady?.();
        }}
        className="h-full w-full"
      />
    </div>
  );
}
