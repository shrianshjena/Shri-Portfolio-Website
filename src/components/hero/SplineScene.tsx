"use client";

import { useCallback, useEffect, useRef } from "react";
import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";
import { SPLINE_SCENE_URL, SPLINE_IDLE_VISIBILITY } from "@/lib/constants";

/*
 * Lazy-loaded Spline robot scene (the only 3D object on the site). The
 * runtime renders CONTINUOUSLY by design: the scene's autonomous idle,
 * blink and facial animations need a live render loop (renderOnDemand only
 * painted frames on interaction, freezing them). Power is managed by
 * stopping the app outright whenever any run condition fails: hero
 * effectively offscreen, tab hidden, or the user holding the scene. All
 * three inputs converge in applyRunState so no single event handler can
 * restart the loop while another condition still says stop.
 */
interface SplineSceneProps {
  readonly onReady?: () => void;
  /** User-facing pause (WCAG 2.2.2): wins over every automatic resume. */
  readonly held?: boolean;
}

type PlayableApp = { stop?: () => void; play?: () => void };

export default function SplineScene({
  onReady,
  held = false,
}: SplineSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  /* HeroVisual mounts this scene only once the hero is intersecting, so the
   * initial mount is in view by definition; the observer's first callback
   * corrects this immediately either way. */
  const inViewRef = useRef(true);
  const heldRef = useRef(held);

  /* Single authority over the render loop. Every event source funnels here,
   * so a tab return while scrolled away, or a load that finishes offscreen,
   * never restarts the loop. */
  const applyRunState = useCallback((): void => {
    const app = appRef.current as unknown as PlayableApp | null;
    if (!app) return;
    if (inViewRef.current && !document.hidden && !heldRef.current) {
      app.play?.();
    } else {
      app.stop?.();
    }
  }, []);

  useEffect(() => {
    heldRef.current = held;
    applyRunState();
  }, [held, applyRunState]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.intersectionRatio > SPLINE_IDLE_VISIBILITY;
        applyRunState();
      },
      { threshold: [0, SPLINE_IDLE_VISIBILITY, 0.5] },
    );
    observer.observe(host);

    document.addEventListener("visibilitychange", applyRunState);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", applyRunState);
    };
  }, [applyRunState]);

  return (
    <div ref={hostRef} className="h-full w-full">
      <Spline
        scene={SPLINE_SCENE_URL}
        onLoad={(app: Application) => {
          appRef.current = app;
          /* A scene that finishes loading offscreen, in a hidden tab, or
           * under a user hold starts stopped. */
          applyRunState();
          onReady?.();
        }}
        className="h-full w-full"
      />
    </div>
  );
}
