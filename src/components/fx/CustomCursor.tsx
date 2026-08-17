"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { CURSOR_RING_LERP_S } from "@/lib/constants";
import { MEDIA } from "@/lib/motion";

/*
 * Custom cursor: instant dot + lerped ring. States come from the nearest
 * [data-cursor] ancestor under the pointer: "link" | "view" | "drag" |
 * "hold" | "hide". Renders nothing on touch devices and under reduced
 * motion, so keyboard and touch users keep the native cursor.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    const isReduced = window.matchMedia(MEDIA.reduce).matches;
    setEnabled(isFine && !isReduced);
  }, []);

  if (!enabled) return null;
  return <CursorLayer />;
}

const LABELS: Record<string, string> = {
  view: "VIEW",
  drag: "DRAG",
  hold: "HOLD",
};

function CursorLayer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, []);

  useGSAP(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });

    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");
    const ringX = gsap.quickTo(ring, "x", { duration: CURSOR_RING_LERP_S, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: CURSOR_RING_LERP_S, ease: "power3" });

    const applyMode = (mode: string): void => {
      const text = LABELS[mode] ?? "";
      label.textContent = text;
      const scale = mode === "hide" ? 0 : text ? 2.6 : mode === "link" ? 1.6 : 1;
      gsap.to(ring, { scale, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      gsap.to(dot, {
        opacity: mode === "hide" || text ? 0 : 1,
        duration: 0.2,
        overwrite: "auto",
      });
    };

    const onMove = (event: PointerEvent): void => {
      setDotX(event.clientX);
      setDotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: PointerEvent): void => {
      const target = event.target instanceof Element ? event.target : null;
      const mode = target?.closest("[data-cursor]")?.getAttribute("data-cursor") ?? "";
      applyMode(mode);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
    };
  });

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 size-1.5 rounded-full bg-fg"
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex size-9 items-center justify-center rounded-full border border-line-strong"
      >
        <span ref={labelRef} className="eyebrow !text-[8px] text-fg" />
      </div>
    </div>
  );
}
