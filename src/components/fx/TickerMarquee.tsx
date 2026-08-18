"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { MEDIA } from "@/lib/motion";
import {
  TICKER_LOOP_S,
  TICKER_MAX_SPEED,
  TICKER_VELOCITY_DIVISOR,
} from "@/lib/constants";
import type { TickerContent, TickerItem, TickerTone } from "@/content/types";
import { cn } from "@/lib/cn";

/*
 * The site's only marquee: a financial-tape strip of verified static
 * figures. Desktop: loop speed is modulated by scroll velocity (fast
 * scrolling whips the tape, easing back to a slow drift). Touch: plain
 * autoplay. Reduced motion: static strip, horizontally swipeable.
 * A visible HOLD/RUN control satisfies WCAG 2.2.2 (pause for moving
 * content); hover-pause and the pause control both win over the
 * scroll-velocity coupling.
 */
const TONE_CLASS: Record<TickerTone, string> = {
  default: "text-muted",
  accent: "text-steel",
  amber: "text-amber",
};

function TickerRow({
  items,
  hidden,
}: {
  readonly items: readonly TickerItem[];
  readonly hidden?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden ? "true" : undefined}
      className="flex items-center gap-10 pr-10"
    >
      {items.map((item, index) => (
        <span
          key={`${item.text}-${index}`}
          className={cn(
            "eyebrow whitespace-nowrap !text-xs",
            TONE_CLASS[item.tone ?? "default"],
          )}
        >
          {item.text}
          <span aria-hidden="true" className="ml-10 text-line-strong">
            //
          </span>
        </span>
      ))}
    </div>
  );
}

export function TickerMarquee({ data }: { readonly data: TickerContent }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<gsap.core.Tween | null>(null);
  const holdRef = useRef(false);
  const [held, setHeld] = useState(false);

  /* The HOLD button freezes the tape regardless of tier or hover state. */
  useEffect(() => {
    holdRef.current = held;
    const loop = loopRef.current;
    if (!loop) return;
    gsap.to(loop, {
      timeScale: held ? 0 : 1,
      duration: 0.4,
      overwrite: "auto",
    });
  }, [held]);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;

      const buildLoop = () => {
        const loop = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: TICKER_LOOP_S,
          repeat: -1,
        });
        loopRef.current = loop;
        return loop;
      };

      const mm = gsap.matchMedia();

      mm.add(MEDIA.full, () => {
        const loop = buildLoop();
        let hovered = false;

        const trigger = ScrollTrigger.create({
          onUpdate: (self) => {
            if (hovered || holdRef.current) return;
            const velocity = gsap.utils.clamp(
              -TICKER_MAX_SPEED,
              TICKER_MAX_SPEED,
              self.getVelocity() / TICKER_VELOCITY_DIVISOR,
            );
            if (Math.abs(velocity) <= 1) return;
            gsap.to(loop, {
              timeScale: velocity,
              duration: 0.3,
              overwrite: "auto",
              onComplete: () => {
                if (hovered || holdRef.current) return;
                gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out" });
              },
            });
          },
        });

        const pause = (): void => {
          hovered = true;
          gsap.to(loop, { timeScale: 0, duration: 0.4, overwrite: "auto" });
        };
        const resume = (): void => {
          hovered = false;
          if (holdRef.current) return;
          gsap.to(loop, { timeScale: 1, duration: 0.6, overwrite: "auto" });
        };
        root.addEventListener("pointerenter", pause);
        root.addEventListener("pointerleave", resume);

        return () => {
          root.removeEventListener("pointerenter", pause);
          root.removeEventListener("pointerleave", resume);
          trigger.kill();
          loop.kill();
          loopRef.current = null;
        };
      });

      mm.add(MEDIA.lite, () => {
        const loop = buildLoop();
        return () => {
          loop.kill();
          loopRef.current = null;
        };
      });
      /* MEDIA.reduce: no loop is built; the strip stays static. */
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} data-cursor="hold" className="hairline-t hairline-b py-5">
      <div
        role="region"
        aria-label="Career figures ticker"
        tabIndex={0}
        className="overflow-hidden motion-reduce:overflow-x-auto motion-reduce:no-scrollbar"
      >
        <div ref={trackRef} className="flex w-max">
          <TickerRow items={data.items} />
          <TickerRow items={data.items} hidden />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-6 px-6 md:px-12 lg:px-20">
        <p className="eyebrow !text-[9px] !tracking-[0.28em] text-muted">
          {data.caption}
        </p>
        <button
          type="button"
          onClick={() => setHeld((value) => !value)}
          aria-pressed={held}
          data-cursor="link"
          className="eyebrow shrink-0 border border-line px-3 py-1.5 !text-[9px] text-steel transition-colors hover:border-line-strong motion-reduce:hidden"
        >
          {held ? "RUN ▸" : "HOLD ⏸"}
        </button>
      </div>
    </div>
  );
}
