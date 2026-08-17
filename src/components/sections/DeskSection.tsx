"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { MEDIA, EASE, DUR } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EquityCurve } from "@/components/fx/EquityCurve";
import { DeskPanel } from "@/components/sections/DeskPanel";
import { cn } from "@/lib/cn";
import type { DeskContent } from "@/content/types";

/*
 * Chapter 03, THE DESK. Flagship horizontal pinned chapter.
 *
 * Tiers, applied as data attributes on the section root (named group "desk")
 * so one DOM tree restyles per tier with zero duplicated content:
 *   full   pinned 100vh chapter, GSAP scrubs the track horizontally while
 *          the backtest equity curve draws itself across the full track.
 *   lite   same track as a native horizontal swipe strip, snap mandatory,
 *          simple fade-rise on entry, curve pre-drawn behind the panels.
 *   reduce (and SSR / no JS) vertical stack, curve fully drawn above the
 *          panels, no pins, no scrubs.
 */

type MotionTier = "full" | "lite" | "reduce";

function applyTier(root: HTMLElement, tier: MotionTier): void {
  root.dataset.tier = tier;
  root.dataset.axis = tier === "reduce" ? "y" : "x";
}

export interface DeskSectionProps {
  readonly data: DeskContent;
}

export function DeskSection({ data }: DeskSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingId = `${data.anchor}-heading`;

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      const track = trackRef.current;
      if (!root || !pin || !track) return;

      const mm = gsap.matchMedia();

      mm.add(MEDIA.full, () => {
        applyTier(root, "full");
        const path = track.querySelector<SVGPathElement>(".equity-path");
        const distance = () => track.scrollWidth - window.innerWidth;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline.to(track, { x: () => -distance(), ease: EASE.none }, 0);

        if (path) {
          gsap.set(path, { drawSVG: "0%" });
          timeline.to(path, { drawSVG: "100%", ease: EASE.none }, 0);
        }
      });

      mm.add(MEDIA.lite, () => {
        applyTier(root, "lite");
        gsap.from(pin, {
          autoAlpha: 0,
          y: 40,
          duration: DUR.base,
          ease: EASE.out,
          scrollTrigger: { trigger: pin, start: "top 85%", once: true },
        });
      });

      mm.add(MEDIA.reduce, () => {
        applyTier(root, "reduce");
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      id={data.anchor}
      aria-labelledby={headingId}
      className="group/desk relative"
    >
      <div className="px-6 pb-14 pt-28 md:px-12 md:pb-20 md:pt-40 lg:px-20">
        <SectionHeading
          eyebrow={data.eyebrow}
          heading={data.heading}
          headingId={headingId}
        />
        <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-muted md:text-lg">
          {data.introLine}
        </p>
        <p className="eyebrow mt-5 !text-[10px]">{data.contextLine}</p>
      </div>

      {/* Single accessible description of the curve; both rendered instances
          below are decorative presentations of it. */}
      <p className="sr-only">{data.curve.description}</p>

      {/* Stacked tier (reduce / SSR): curve fully drawn above the panels. */}
      <div
        aria-hidden="true"
        className="px-6 pb-14 md:px-12 lg:px-20 group-data-[axis=x]/desk:hidden"
      >
        <EquityCurve curve={data.curve} animate="enter" className="opacity-80" />
      </div>

      <div
        ref={pinRef}
        data-cursor="drag"
        className={cn(
          "relative",
          "group-data-[tier=full]/desk:h-screen group-data-[tier=full]/desk:overflow-hidden",
          "group-data-[tier=lite]/desk:snap-x group-data-[tier=lite]/desk:snap-mandatory",
          "group-data-[tier=lite]/desk:overflow-x-auto group-data-[tier=lite]/desk:no-scrollbar",
          "group-data-[tier=lite]/desk:pb-24",
        )}
      >
        <div
          ref={trackRef}
          className={cn(
            "desk-track relative flex flex-col gap-6 px-6 pb-28 md:px-12 md:pb-40 lg:px-20",
            "group-data-[axis=x]/desk:w-max group-data-[axis=x]/desk:flex-row",
            "group-data-[axis=x]/desk:px-6 group-data-[axis=x]/desk:pb-0",
            "group-data-[tier=full]/desk:h-full group-data-[tier=full]/desk:items-center",
            "group-data-[tier=lite]/desk:items-stretch group-data-[tier=lite]/desk:py-6",
          )}
        >
          {/* Equity curve across the full width of the moving track, behind
              the panels. Drawn by the pinned timeline in the full tier. */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute inset-x-0 hidden opacity-40",
              "group-data-[axis=x]/desk:block",
              "group-data-[tier=full]/desk:top-1/2 group-data-[tier=full]/desk:h-[70vh]",
              "group-data-[tier=full]/desk:-translate-y-1/2",
              "group-data-[tier=lite]/desk:inset-y-6",
            )}
          >
            <EquityCurve curve={data.curve} animate="none" className="h-full" />
          </div>

          {/* Intro spacer panel, horizontal tiers only. Decorative chrome. */}
          <div
            aria-hidden="true"
            className={cn(
              "relative hidden w-[38vw] shrink-0 flex-col justify-between self-stretch",
              "py-[10vh] group-data-[axis=x]/desk:flex",
            )}
          >
            <span className="mono-nums text-[20vw] leading-none text-steel/15 lg:text-[10rem]">
              {data.num}
            </span>
            <div>
              <p className="eyebrow">
                SCROLL <span className="text-steel">→</span>
              </p>
              <p className="eyebrow mt-2 !text-[10px] text-muted">
                DRAG TO TRAVERSE
              </p>
            </div>
          </div>

          {data.panels.map((panel) => (
            <DeskPanel key={panel.id} panel={panel} />
          ))}
        </div>
      </div>
    </section>
  );
}
