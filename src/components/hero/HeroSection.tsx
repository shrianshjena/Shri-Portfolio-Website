"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import type { HeroContent } from "@/content/types";
import { useLoading } from "@/components/providers/LoadingProvider";
import { ScrambleText } from "@/components/fx/ScrambleText";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { HeroVisual } from "./HeroVisual";
import { HeroAudioCta } from "./HeroAudioCta";

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
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_48%]">
        <div className="min-w-0">
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

        {/* Negative margins let the canvas bleed toward the top/bottom/right
         * gutters on desktop so the robot reads larger in the composition. */}
        <div className="hero-rise relative h-[50svh] lg:h-[82svh] lg:-my-10 lg:-mr-10">
          <HeroVisual posterAlt={data.posterAlt} />
        </div>
      </div>

      {/* Three-zone bottom bar on md+: empty left balance, the music CTA
       * dead center (Lovable-style), the scroll cue on the right. On
       * mobile the bar sits in flow below the visual so the CTA never
       * overlaps the robot. */}
      <div className="pointer-events-none relative mt-8 grid grid-cols-1 justify-items-center md:absolute md:inset-x-12 md:bottom-6 md:mt-0 md:grid-cols-3 md:items-end lg:inset-x-20">
        <span aria-hidden="true" className="hidden md:block" />
        <div className="hero-rise pointer-events-auto justify-self-center">
          <HeroAudioCta label={data.audioHint} />
        </div>
        <p className="eyebrow hidden !text-[10px] text-muted md:block justify-self-end">
          SCROLL ▼
        </p>
      </div>
    </section>
  );
}
