"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";

/*
 * Number count-up. The final value is server-rendered (SEO and reduced
 * motion see it immediately); on capable clients the number animates from 0
 * once, when scrolled into view. Tabular numerals prevent width jitter.
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
  const ref = useRef<HTMLSpanElement>(null);

  const format = (current: number): string =>
    `${prefix}${current.toFixed(decimals)}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia(MEDIA.reduce).matches) return;

      const proxy = { current: 0 };
      el.textContent = format(0);

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(proxy, {
            current: value,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = format(proxy.current);
            },
          });
        },
      });
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={cn("mono-nums", className)}>
      {format(value)}
    </span>
  );
}
