"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";

/*
 * The single RAF loop of the app: GSAP's ticker drives Lenis, Lenis's scroll
 * event drives ScrollTrigger. autoRaf must stay false so no second loop runs.
 * Under prefers-reduced-motion the Lenis instance is destroyed and the page
 * uses native scrolling.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    if (window.matchMedia(MEDIA.reduce).matches) {
      lenis.destroy();
      return;
    }

    const update = (time: number): void => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    document.fonts.ready
      .then(() => ScrollTrigger.refresh())
      .catch(() => undefined);

    return () => {
      gsap.ticker.remove(update);
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, anchors: true }}
    >
      {children}
    </ReactLenis>
  );
}
