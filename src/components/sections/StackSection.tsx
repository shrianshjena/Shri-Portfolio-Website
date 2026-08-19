"use client";

import { useRef } from "react";
import type { StackContent, StackGroup } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { STACK_TILE_DRIFT_PX, STACK_TILE_TILT_DEG } from "@/lib/constants";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RailHeader } from "@/components/ui/RailHeader";
import { cn } from "@/lib/cn";

/*
 * Chapter 07, THE STACK. Three instrument bands (ANALYSIS / BUILD & SHIP /
 * AI SYSTEMS), each a hairline tile lattice of monochrome tool marks.
 *
 * Signature move: scroll-rotation settle. On the full tier every tile
 * enters pre-tilted (alternating +/- STACK_TILE_TILT_DEG) and drifted
 * down, then rotates flat and rises to rest as the band scrubs through
 * the viewport; the lattice reads as instruments locking into
 * calibration. Not pinned; tilted tiles are clipped by their
 * overflow-hidden cells so the page never scrolls horizontally.
 *
 * Tiers:
 *   full   per-band scrubbed rotation/drift/opacity settle on the
 *          [data-tile] wrappers. GSAP owns transform+opacity there; the
 *          hover opacity/color transitions live on the inner img/span,
 *          different elements, so no engine collision.
 *   lite   per-band once-only batch rise, no scrub.
 *   reduce everything static at its final visible state.
 */

export interface StackSectionProps {
  readonly data: StackContent;
}

const HEADING_ID = "stack-heading";

/* Full-tier settle scrub. */
const TILT_FROM_OPACITY = 0.4;
const TILT_STAGGER_S = 0.04;
const TILT_SCRUB = 0.8;
const TILT_START = "top 90%";
const TILT_END = "top 40%";

/* Lite-tier / intro rise. */
const RISE_Y = 20;
const RISE_STAGGER_S = 0.05;
const RISE_START = "top 85%";

/* Lattice geometry: mobile always runs 3 columns; wider viewports pick
 * the column count that divides the band most cleanly (6 tools -> one
 * clean row of 6, otherwise 5 columns). */
const MOBILE_COLS = 3;

function bandColumns(count: number): {
  readonly gridClass: string;
  readonly wideCols: number;
} {
  if (count % 6 === 0) {
    return { gridClass: "grid-cols-3 sm:grid-cols-6", wideCols: 6 };
  }
  return { gridClass: "grid-cols-3 sm:grid-cols-5", wideCols: 5 };
}

/* Empty cells needed so the hairline lattice completes its last row. */
function fillerCount(count: number, cols: number): number {
  return (cols - (count % cols)) % cols;
}

export function StackSection({ data }: StackSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const intro = scope.querySelector<HTMLElement>("[data-stack-intro]");
      const bands = gsap.utils.toArray<HTMLElement>("[data-band]", scope);
      const allTiles = gsap.utils.toArray<HTMLElement>("[data-tile]", scope);

      const riseIntro = () => {
        if (!intro) return;
        gsap.fromTo(
          intro,
          { opacity: 0, y: RISE_Y },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            scrollTrigger: { trigger: intro, start: RISE_START, once: true },
          },
        );
      };

      const mm = gsap.matchMedia();

      /* Full: per-band scrubbed settle with alternating tilt. */
      mm.add(MEDIA.full, () => {
        riseIntro();
        bands.forEach((band) => {
          const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", band);
          if (tiles.length === 0) return;
          gsap.fromTo(
            tiles,
            {
              rotation: (i: number) => (i % 2 ? -1 : 1) * STACK_TILE_TILT_DEG,
              y: STACK_TILE_DRIFT_PX,
              opacity: TILT_FROM_OPACITY,
              transformOrigin: "50% 50%",
            },
            {
              rotation: 0,
              y: 0,
              opacity: 1,
              ease: EASE.none,
              stagger: TILT_STAGGER_S,
              scrollTrigger: {
                trigger: band,
                start: TILT_START,
                end: TILT_END,
                scrub: TILT_SCRUB,
              },
            },
          );
        });
      });

      /* Lite: per-band once-only batch rise, no scrub. */
      mm.add(MEDIA.lite, () => {
        riseIntro();
        bands.forEach((band) => {
          const tiles = gsap.utils.toArray<HTMLElement>("[data-tile]", band);
          if (tiles.length === 0) return;
          gsap.fromTo(
            tiles,
            { opacity: 0, y: RISE_Y },
            {
              opacity: 1,
              y: 0,
              duration: DUR.fast,
              ease: EASE.out,
              stagger: RISE_STAGGER_S,
              scrollTrigger: { trigger: band, start: RISE_START, once: true },
            },
          );
        });
      });

      /* Reduce: everything static at its final visible state. */
      mm.add(MEDIA.reduce, () => {
        const targets = intro ? [intro, ...allTiles] : allTiles;
        if (targets.length === 0) return;
        gsap.set(targets, { clearProps: "opacity,transform" });
      });
    },
    { scope: scopeRef },
  );

  return (
    <SectionShell anchor={data.anchor} labelledBy={HEADING_ID}>
      <div ref={scopeRef}>
        <SectionHeading
          eyebrow={data.eyebrow}
          heading={data.heading}
          headingId={HEADING_ID}
        />

        <p
          data-stack-intro
          className="mt-8 max-w-[42ch] leading-relaxed text-muted"
        >
          {data.intro}
        </p>

        <div className="mt-16 space-y-20 md:mt-24">
          {data.groups.map((group) => (
            <StackBand key={group.label} group={group} />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function StackBand({ group }: { readonly group: StackGroup }) {
  const count = group.tools.length;
  const { gridClass, wideCols } = bandColumns(count);
  const mobileFill = fillerCount(count, MOBILE_COLS);
  const wideFill = fillerCount(count, wideCols);
  const totalFill = Math.max(mobileFill, wideFill);

  return (
    <div data-band>
      <RailHeader
        as="h3"
        label={group.label}
        meta={`${String(count).padStart(2, "0")} TOOLS`}
      />
      <ul className={cn("mt-6 grid gap-px bg-line", gridClass)}>
        {group.tools.map((tool) => (
          <li
            key={tool.name}
            className="group aspect-square overflow-hidden bg-canvas"
          >
            <div
              data-tile
              className="flex h-full w-full flex-col items-center justify-center gap-3"
            >
              {/* Vendor marks are flattened to monochrome white via
               * brightness-0 invert; the visible span below carries the
               * accessible name, so the img stays decorative. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tool.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="h-8 w-8 object-contain opacity-70 brightness-0 invert transition-opacity duration-300 group-hover:opacity-100 md:h-9 md:w-9"
              />
              <span className="mono-nums text-[10px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 group-hover:text-fg">
                {tool.name}
              </span>
            </div>
          </li>
        ))}
        {Array.from({ length: totalFill }, (_, index) => (
          <li
            key={`filler-${index}`}
            aria-hidden="true"
            className={cn(
              "bg-canvas",
              index >= wideFill && "sm:hidden",
              index >= mobileFill && "hidden sm:block",
            )}
          />
        ))}
      </ul>
    </div>
  );
}
