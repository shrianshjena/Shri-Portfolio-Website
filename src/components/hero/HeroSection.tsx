"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import type { HeroContent } from "@/content/types";
import { useLoading } from "@/components/providers/LoadingProvider";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { HeroVisual } from "./HeroVisual";

/*
 * Chapter 01. The preloader wipe hands off here: when loading status flips
 * to "done", the headline scrambles in (scanline sweeping down) and the
 * supporting rows rise. The Spline robot occupies the right half on desktop;
 * mobile and reduced motion get the static poster.
 */
export function HeroSection({ data }: { readonly data: HeroContent }) {
  const { status } = useLoading();
  const ready = status === "done";
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia(MEDIA.reduce).matches) return;
      gsap.set(".hero-rise", { opacity: 0, y: 24 });
      if (!ready) return;
      gsap.to(".hero-rise", {
        opacity: 1,
        y: 0,
        duration: DUR.base,
        ease: EASE.out,
        stagger: 0.12,
        delay: 0.7,
      });
    },
    { scope, dependencies: [ready] },
  );

  return (
    <section
      ref={scope}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh flex-col justify-center px-6 pb-16 pt-24 md:px-12 lg:px-20"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_45%]">
        <div>
          <ScrambleText
            as="p"
            trigger="play"
            play={ready}
            delay={0.2}
            duration={0.9}
            className="eyebrow"
          >
            {data.eyebrow}
          </ScrambleText>

          <h1 id="hero-heading" className="display-hero mt-6 text-fg">
            {data.headlineLines.map((line, index) => (
              <ScrambleText
                key={line}
                as="span"
                trigger="play"
                play={ready}
                delay={0.4 + index * 0.25}
                duration={1.2}
                scanline
              >
                {line}
              </ScrambleText>
            ))}
          </h1>

          <p className="hero-rise mt-8 max-w-md text-base leading-relaxed text-muted">
            {data.sub}
          </p>

          <div className="hero-rise mt-10 flex flex-wrap items-center gap-8">
            {data.ctas.map((cta) => (
              <ArrowLink
                key={cta.label}
                href={cta.href}
                external={cta.external}
                arrow={cta.href.startsWith("#") ? "down" : "out"}
              >
                {cta.label}
              </ArrowLink>
            ))}
          </div>
        </div>

        <div className="hero-rise relative h-[46svh] lg:h-[70svh]">
          <HeroVisual posterAlt={data.posterAlt} />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-end justify-between md:inset-x-12 lg:inset-x-20">
        <p className="eyebrow !text-[10px] text-muted">{data.audioHint}</p>
        <p className="eyebrow hidden !text-[10px] text-muted md:block">SCROLL ▼</p>
      </div>
    </section>
  );
}
