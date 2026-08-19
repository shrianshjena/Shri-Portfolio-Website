"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";

/*
 * Number count-up. The final value is server-rendered (SEO and reduced
 * motion see it immediately); on capable clients the number animates from 0
 * once, when actually visible. Visibility comes from IntersectionObserver
 * rather than ScrollTrigger so the animation also times correctly inside
 * horizontally translated pinned tracks (the Desk chapter), where document
 * scroll position says nothing about whether the panel is on screen.
 * Tabular numerals prevent width jitter.
 *
 * Mirroring the Decode sr-only pattern, the animated span is aria-hidden
 * and paired with an sr-only twin holding the formatted final value, so
 * assistive tech and find-in-page always read the real number instead of
 * the 0 the animation starts from.
 */
interface CountUpProps {
  readonly value: number;
  readonly decimals?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly duration?: number;
  readonly className?: string;
}

export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: CountUpProps) {
  const animatedRef = useRef<HTMLSpanElement>(null);

  const format = (current: number): string =>
    `${prefix}${current.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const el = animatedRef.current;
      if (!el) return;
      if (window.matchMedia(MEDIA.reduce).matches) return;

      const proxy = { current: 0 };
      el.textContent = format(0);

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          gsap.to(proxy, {
            current: value,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = format(proxy.current);
            },
          });
        },
        { threshold: 0.5 },
      );
      observer.observe(el);
      return () => observer.disconnect();
    },
    { scope: animatedRef },
  );

  return (
    <span className={cn("mono-nums", className)}>
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden="true" ref={animatedRef}>
        {format(value)}
      </span>
    </span>
  );
}
