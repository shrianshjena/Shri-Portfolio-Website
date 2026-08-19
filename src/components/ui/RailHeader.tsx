"use client";

import { useEffect, useRef, useState } from "react";
import { Decode } from "@/components/fx/Decode";
import { cn } from "@/lib/cn";

/*
 * Instrument rail header: a hollow steel ring that fills when the rail
 * scrolls into view, a decoded mono label, a hairline running to the
 * container edge with a terminal tick, and an optional right-aligned meta
 * readout. The ring fill is a CSS color transition driven by state; GSAP
 * never touches it (one engine per property). Ring, rail and tick are
 * decorative; the label carries the accessible text via Decode.
 */

interface RailHeaderProps {
  readonly label: string;
  readonly meta?: string;
  readonly as?: "h3" | "p" | "div";
  readonly className?: string;
}

const IN_VIEW_MARGIN = "-15% 0px";

export function RailHeader({
  label,
  meta,
  as = "p",
  className,
}: RailHeaderProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: IN_VIEW_MARGIN },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "h-[7px] w-[7px] shrink-0 rounded-full border border-steel transition-colors duration-500",
          inView && "bg-steel",
        )}
      />
      <Decode as={as} className="eyebrow shrink-0">
        {label}
      </Decode>
      <span aria-hidden="true" className="relative h-px min-w-6 flex-1 bg-line">
        <span className="absolute right-0 top-1/2 h-[7px] w-px -translate-y-1/2 bg-line-strong" />
      </span>
      {meta ? <span className="eyebrow shrink-0 text-muted">{meta}</span> : null}
    </div>
  );
}
