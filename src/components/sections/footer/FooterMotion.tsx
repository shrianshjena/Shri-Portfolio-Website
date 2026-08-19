"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";

/*
 * Footer entrance choreography. A client wrapper around the server-rendered
 * footer markup: elements tagged [data-footer-rise] rise into place with a
 * stagger and the [data-footer-line] top hairline draws left to right, all
 * on one once-only ScrollTrigger. From-states are set inside the full/lite
 * branches only, so the reduce tier (and no-JS) keeps the server-rendered
 * final states untouched.
 */

const RISE_Y_PX = 24;
const RISE_STAGGER_S = 0.12;
const ENTRANCE_START = "top 92%";

interface FooterMotionProps {
  readonly children: ReactNode;
}

export function FooterMotion({ children }: FooterMotionProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = hostRef.current;
      if (!host) return;

      const enter = () => {
        const risers = gsap.utils.toArray<HTMLElement>(
          "[data-footer-rise]",
          host,
        );
        const line = host.querySelector<HTMLElement>("[data-footer-line]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: host,
            start: ENTRANCE_START,
            once: true,
          },
        });

        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: DUR.slow, ease: EASE.inOut },
            0,
          );
        }
        if (risers.length > 0) {
          tl.fromTo(
            risers,
            { opacity: 0, y: RISE_Y_PX },
            {
              opacity: 1,
              y: 0,
              duration: DUR.base,
              ease: EASE.out,
              stagger: RISE_STAGGER_S,
            },
            0,
          );
        }
      };

      const mm = gsap.matchMedia();
      mm.add(MEDIA.full, enter);
      mm.add(MEDIA.lite, enter);
      /* Reduce: no from-states are ever set; the static markup stands. */
    },
    { scope: hostRef },
  );

  return <div ref={hostRef}>{children}</div>;
}
