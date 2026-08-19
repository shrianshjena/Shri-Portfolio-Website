"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { EASE, MEDIA, SCRAMBLE_CHARS } from "@/lib/motion";
import { DECODE_CHAR_S, DECODE_MAX_S, DECODE_MIN_S } from "@/lib/constants";
import { cn } from "@/lib/cn";

/*
 * Log-entry decode: text resolves left-to-right out of a glyph scramble,
 * the "instrument acquiring a reading" register. Ported from the SOLAS
 * MODU Decode device and adapted to this site's tier contract.
 *
 * The real copy is server-rendered inside the animated span, so crawlers,
 * no-JS visitors and the reduce tier always see final text; the scramble
 * only takes over when the trigger fires. A separate sr-only node keeps
 * the accessible name stable while the animated twin is aria-hidden.
 *
 * reserveLayout: an invisible sizer holds the final text's box from first
 * paint while the scramble runs in an absolute overlay at constant string
 * length (tweenLength: false), so multi-line copy never shifts layout.
 *
 * Bottom-of-page consumers must pass start="top bottom": the default
 * "top 88%" can never fire for an element pinned to the page floor.
 */

type DecodeTag = "p" | "span" | "h3" | "div" | "li" | "figcaption";

interface DecodeProps {
  readonly children: string;
  readonly as?: DecodeTag;
  readonly trigger?: "enter" | "play";
  readonly play?: boolean;
  readonly delay?: number;
  readonly start?: string;
  readonly reserveLayout?: boolean;
  readonly maxDuration?: number;
  /* "both" (default) decodes on full and lite tiers; "full" restricts the
   * decode to desktop so long body copy stays a plain reveal on mobile. */
  readonly tiers?: "both" | "full";
  readonly className?: string;
}

const ENTER_START = "top 88%";

export function Decode({
  children,
  as: Tag = "span",
  trigger = "enter",
  play = false,
  delay = 0,
  start = ENTER_START,
  reserveLayout = false,
  maxDuration = DECODE_MAX_S,
  tiers = "both",
  className,
}: DecodeProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);

  useGSAP(
    () => {
      const target = targetRef.current;
      if (!target || playedRef.current) return;

      const duration = Math.min(
        maxDuration,
        Math.max(DECODE_MIN_S, children.length * DECODE_CHAR_S),
      );

      const decode = () => {
        /* Guard inside the matchMedia callback too: crossing the full/lite
         * boundary re-runs decode(), and without this a played text would
         * gain a redundant ScrollTrigger and re-scramble. */
        if (playedRef.current) return;
        const tween = () => {
          playedRef.current = true;
          gsap.to(target, {
            duration,
            delay,
            ease: EASE.out,
            scrambleText: {
              text: children,
              chars: SCRAMBLE_CHARS,
              speed: 0.4,
              revealDelay: 0.05,
              /* Constant string length keeps the overlay's wrap points
               * stable (mono advance width), so the reserved box never
               * reflows mid-decode. */
              ...(reserveLayout ? { tweenLength: false } : {}),
            },
          });
        };
        if (trigger === "enter") {
          ScrollTrigger.create({
            trigger: target,
            start,
            once: true,
            onEnter: tween,
          });
        } else if (play) {
          tween();
        }
      };

      const mm = gsap.matchMedia();
      mm.add(MEDIA.full, decode);
      if (tiers === "both") {
        mm.add(MEDIA.lite, decode);
      }
      /* Reduce: the server-rendered final text stands, nothing to do. */
    },
    { scope: hostRef, dependencies: [play], revertOnUpdate: true },
  );

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={hostRef as any}
      className={cn(reserveLayout && "relative block", className)}
    >
      <span className="sr-only">{children}</span>
      {reserveLayout ? (
        <>
          <span aria-hidden="true" className="invisible block">
            {children}
          </span>
          <span
            aria-hidden="true"
            ref={targetRef}
            className="absolute inset-0 block"
          >
            {children}
          </span>
        </>
      ) : (
        <span aria-hidden="true" ref={targetRef}>
          {children}
        </span>
      )}
    </Tag>
  );
}
