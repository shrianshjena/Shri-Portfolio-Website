"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MAGNET_STRENGTH } from "@/lib/constants";
import { EASE, MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";

/*
 * Magnetic hover: the inner element lerps toward the pointer inside the
 * wrapper and springs back elastically on leave. Pointer effects animate the
 * inner node only; scroll-driven transforms may own the wrapper (one engine
 * per property). Inert on touch and under reduced motion.
 */
interface MagneticButtonProps {
  readonly children: ReactNode;
  readonly strength?: number;
  readonly className?: string;
}

export function MagneticButton({
  children,
  strength = MAGNET_STRENGTH,
  className,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const inner = innerRef.current;
      if (!wrap || !inner) return;
      if (!window.matchMedia("(pointer: fine)").matches) return;
      if (window.matchMedia(MEDIA.reduce).matches) return;

      const xTo = gsap.quickTo(inner, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(inner, "y", { duration: 0.35, ease: "power3" });

      const onMove = (event: PointerEvent): void => {
        const rect = wrap.getBoundingClientRect();
        xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
      };

      const onLeave = (): void => {
        gsap.to(inner, {
          x: 0,
          y: 0,
          duration: 0.9,
          ease: EASE.elastic,
          overwrite: "auto",
        });
      };

      wrap.addEventListener("pointermove", onMove, { passive: true });
      wrap.addEventListener("pointerleave", onLeave, { passive: true });
      return () => {
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: wrapRef },
  );

  return (
    <span ref={wrapRef} className={cn("inline-block", className)}>
      <span ref={innerRef} className="inline-block">
        {children}
      </span>
    </span>
  );
}
