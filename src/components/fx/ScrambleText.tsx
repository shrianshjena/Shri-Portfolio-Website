"use client";

import { useRef, type CSSProperties } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { MEDIA, SCRAMBLE_CHARS } from "@/lib/motion";
import { cn } from "@/lib/cn";

/*
 * Holographic glitch reveal: characters scramble and resolve while a
 * scanline tracks down the element, color resolving from translucent steel
 * blue to the element's own color. The real text is server-rendered and kept
 * as the host's aria-label; the animated span is aria-hidden, so screen
 * readers and crawlers always see the final copy.
 *
 * trigger "enter": plays once when scrolled into view.
 * trigger "play":  plays when the `play` prop turns true (hero/preloader).
 * Reduced motion: no effect at all, text renders plainly.
 */
type ScrambleTag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface ScrambleTextProps {
  readonly children: string;
  readonly as?: ScrambleTag;
  readonly id?: string;
  readonly trigger?: "enter" | "play";
  readonly play?: boolean;
  readonly duration?: number;
  readonly delay?: number;
  readonly scanline?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}

const START_COLOR = "rgba(120, 176, 240, 0.55)";
const ENTER_START = "top 88%";

export function ScrambleText({
  children,
  as: Tag = "span",
  id,
  trigger = "enter",
  play = false,
  duration = 1.1,
  delay = 0,
  scanline = false,
  className,
  style,
}: ScrambleTextProps) {
  const hostRef = useRef<HTMLElement | null>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const scanRef = useRef<HTMLSpanElement>(null);
  const playedRef = useRef(false);

  useGSAP(
    () => {
      const host = hostRef.current;
      const text = textRef.current;
      if (!host || !text || playedRef.current) return;
      if (window.matchMedia(MEDIA.reduce).matches) return;

      const finalColor = getComputedStyle(text).color;
      const timeline = gsap.timeline({
        paused: true,
        delay,
        onComplete: () => {
          playedRef.current = true;
        },
      });

      timeline.set(text, { color: START_COLOR }, 0);
      timeline.to(
        text,
        {
          duration,
          ease: "none",
          scrambleText: {
            text: children,
            chars: SCRAMBLE_CHARS,
            speed: 0.4,
          },
        },
        0,
      );
      timeline.to(
        text,
        {
          color: finalColor,
          duration: Math.max(duration * 0.5, 0.3),
          ease: "power2.out",
        },
        duration * 0.45,
      );

      const scan = scanRef.current;
      if (scan) {
        timeline.fromTo(
          scan,
          { opacity: 0.9, top: 0 },
          { top: "100%", duration, ease: "none" },
          0,
        );
        timeline.set(scan, { opacity: 0 });
      }

      if (trigger === "enter") {
        ScrollTrigger.create({
          trigger: host,
          start: ENTER_START,
          once: true,
          onEnter: () => timeline.play(),
        });
      } else if (play) {
        timeline.play();
      }
    },
    { scope: hostRef, dependencies: [play], revertOnUpdate: true },
  );

  /* The accessible copy is a real sr-only text node (aria-label is invalid
   * on generic roles like p/span); the animated twin stays aria-hidden. */
  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={hostRef as any}
      id={id}
      className={cn("relative block", className)}
      style={style}
    >
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" ref={textRef} className="block">
        {children}
      </span>
      {scanline ? <span aria-hidden="true" ref={scanRef} className="fx-scanline" /> : null}
    </Tag>
  );
}
