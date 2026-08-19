"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TICKER_LOOP_S } from "@/lib/constants";
import type { TickerContent, TickerItem, TickerTone } from "@/content/types";
import { cn } from "@/lib/cn";

/*
 * The site's only marquee: a financial-tape strip of verified static
 * figures on a constant-speed, fully auto-driven CSS loop (scroll never
 * touches it; the fx-marquee rules in globals.css explain why the loop
 * must not live in JS). Hover and focus pause are pure CSS; the HOLD
 * button and the offscreen gate contribute the fx-marquee-paused class.
 * Reduced motion: the global CSS kill switch stops the animation and the
 * strip stays horizontally swipeable. A visible HOLD/RUN control
 * satisfies WCAG 2.2.2 (pause for moving content).
 */
const IN_VIEW_MARGIN = "120px 0px";
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
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(true);

  /* Park the animation offscreen. IntersectionObserver, not ScrollTrigger:
   * observer geometry never goes stale after layout shifts. Read the
   * NEWEST record: a fast scroll out and back batches [leave, enter] into
   * one callback, and reading the first entry would re-freeze the strip. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setInView(entries[entries.length - 1].isIntersecting);
      },
      { rootMargin: IN_VIEW_MARGIN },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      data-cursor="hold"
      className={cn(
        "fx-marquee hairline-t hairline-b py-5",
        (held || !inView) && "fx-marquee-paused",
      )}
    >
      <div
        role="region"
        aria-label="Career figures ticker"
        tabIndex={0}
        className="overflow-hidden motion-reduce:overflow-x-auto motion-reduce:no-scrollbar"
      >
        <div
          className="fx-marquee-track flex w-max"
          style={{ "--marquee-duration": `${TICKER_LOOP_S}s` } as CSSProperties}
        >
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
