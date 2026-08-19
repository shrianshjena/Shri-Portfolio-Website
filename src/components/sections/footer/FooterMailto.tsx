"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { EASE, MEDIA, SCRAMBLE_CHARS } from "@/lib/motion";
import { Decode } from "@/components/fx/Decode";

/*
 * Giant footer mailto. The visible address decodes once on scroll-enter
 * (start "top bottom": an element at the page floor never crosses the
 * default "top 88%"), and re-scrambles briefly on hover, throttled so
 * repeated passes cannot strobe. The hover tween touches only the
 * aria-hidden decode twin; the sr-only address inside Decode stays stable,
 * so keyboard and touch users simply see the resolved address. GSAP owns
 * the text; the CSS color transition on the anchor is a different property
 * (one engine per property).
 */

const FLOOR_START = "top bottom";
const HOVER_COOLDOWN_MS = 1200;
const HOVER_SCRAMBLE_S = 0.5;
const HOVER_SCRAMBLE_SPEED = 0.4;

interface FooterMailtoProps {
  readonly email: string;
}

export function FooterMailto({ email }: FooterMailtoProps) {
  const hostRef = useRef<HTMLAnchorElement>(null);
  const lastScrambleRef = useRef(0);

  const handleMouseEnter = () => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia(MEDIA.reduce).matches) return;

    const now = Date.now();
    if (now - lastScrambleRef.current < HOVER_COOLDOWN_MS) return;

    /* The animated twin is the last aria-hidden span Decode renders (the
     * absolute overlay in reserveLayout mode); querying by position keeps
     * the sr-only address untouched. */
    const twins = host.querySelectorAll<HTMLElement>('span[aria-hidden="true"]');
    const target = twins[twins.length - 1];
    if (!target) return;

    lastScrambleRef.current = now;
    gsap.to(target, {
      duration: HOVER_SCRAMBLE_S,
      ease: EASE.out,
      overwrite: "auto",
      scrambleText: {
        text: email,
        chars: SCRAMBLE_CHARS,
        speed: HOVER_SCRAMBLE_SPEED,
        /* Constant string length: the reserved box never reflows. */
        tweenLength: false,
      },
    });
  };

  return (
    <a
      ref={hostRef}
      href={`mailto:${email}`}
      data-cursor="link"
      onMouseEnter={handleMouseEnter}
      className="mono-nums inline-block break-all text-[clamp(1.6rem,5vw,4.5rem)] lowercase text-fg transition-colors hover:text-steel"
    >
      <Decode start={FLOOR_START} reserveLayout>
        {email}
      </Decode>
    </a>
  );
}
