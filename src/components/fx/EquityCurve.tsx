"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import type { EquityCurve as EquityCurveData } from "@/content/types";
import { cn } from "@/lib/cn";

/*
 * Backtest equity curve as an inline SVG line-draw (DrawSVG). With
 * animate="enter" it draws itself once on scroll into view; with
 * animate="none" the owning section drives the ".equity-path" element inside
 * its own timeline (used by the pinned Desk chapter). Reduced motion renders
 * the curve fully drawn.
 */
const VIEW_W = 1000;
const VIEW_H = 320;
const PAD = 24;

function buildPath(points: readonly number[]): string {
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  return points
    .map((value, index) => {
      const x = PAD + (index / (points.length - 1)) * (VIEW_W - PAD * 2);
      const y = VIEW_H - PAD - ((value - min) / span) * (VIEW_H - PAD * 2);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

interface EquityCurveProps {
  readonly curve: EquityCurveData;
  readonly animate?: "enter" | "none";
  readonly className?: string;
}

export function EquityCurve({
  curve,
  animate = "enter",
  className,
}: EquityCurveProps) {
  const rootRef = useRef<HTMLElement>(null);
  const path = buildPath(curve.points);

  useGSAP(
    () => {
      if (animate !== "enter") return;
      if (window.matchMedia(MEDIA.reduce).matches) return;
      const root = rootRef.current;
      if (!root) return;

      gsap.from(".equity-path", {
        drawSVG: "0%",
        duration: 2.2,
        ease: "power2.inOut",
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      gsap.from(".equity-dot", {
        opacity: 0,
        duration: 0.5,
        delay: 2.0,
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
    },
    { scope: rootRef },
  );

  const lastX = VIEW_W - PAD;
  const points = curve.points;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const lastY =
    VIEW_H - PAD - ((points[points.length - 1] - min) / (max - min || 1)) * (VIEW_H - PAD * 2);

  return (
    <figure ref={rootRef} className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={curve.description}
        className="h-full w-full overflow-visible"
      >
        <path
          className="equity-path"
          d={path}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          vectorEffect="non-scaling-stroke"
        />
        <circle
          className="equity-dot"
          cx={lastX}
          cy={lastY}
          r={5}
          fill="var(--color-steel)"
        />
      </svg>
      <figcaption className="mt-3 flex items-center justify-between">
        <span className="eyebrow !text-[10px]">{curve.startLabel}</span>
        <span className="eyebrow !text-[10px]">{curve.endLabel}</span>
      </figcaption>
    </figure>
  );
}
