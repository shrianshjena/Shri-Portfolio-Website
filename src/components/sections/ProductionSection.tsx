"use client";

import { useEffect, useRef, useState } from "react";
import type { ArchiveItem, ProductionContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { PlatformCard } from "@/components/sections/PlatformCard";
import { HelixCarousel } from "@/components/sections/HelixCarousel";
import { cn } from "@/lib/cn";

/*
 * Chapter 05, IN PRODUCTION. The four live platforms, then the archive band.
 *
 * Platform display variants, both feeding on the same PlatformCard:
 *   grid   default / SSR / lite / reduce. Hairline-gap grid, fully
 *          accessible, keyboard reachable.
 *   helix  full tier only. The decorative pinned 3D carousel; when it mounts,
 *          the grid drops to sr-only so assistive tech keeps the real list
 *          while sighted fine-pointer users get the rotation.
 *
 * The swap is state-driven and hydration-safe: the server and first client
 * render always produce the grid; a mount effect (plus a media listener for
 * viewport crossings) flips to the helix only when MEDIA.full matches.
 */

export interface ProductionSectionProps {
  readonly data: ProductionContent;
}

interface ArchiveRowProps {
  readonly item: ArchiveItem;
}

const HEADING_ID = "production-heading";
const OFFLINE_BADGE = "RESEARCH · OFFLINE";
const RISE_Y = 28;
const REVEAL_START = "top 88%";

/* One text-only archive row: title + meta left, OPEN link or offline badge
 * right. No images in the archive, per the chapter design. */
function ArchiveRow({ item }: ArchiveRowProps) {
  return (
    <div
      data-archive-row
      className="hairline-t grid gap-3 py-5 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div>
        <h3 className="text-sm uppercase text-fg md:text-base">{item.title}</h3>
        <p className="eyebrow mt-1 text-muted">{item.meta}</p>
      </div>
      <div>
        {item.url ? (
          <ArrowLink href={item.url} external>
            OPEN
          </ArrowLink>
        ) : (
          <Badge>{OFFLINE_BADGE}</Badge>
        )}
      </div>
    </div>
  );
}

export function ProductionSection({ data }: ProductionSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const [isHelix, setIsHelix] = useState(false);

  /* Mount check + media listener: helix only on the full tier. */
  useEffect(() => {
    const query = window.matchMedia(MEDIA.full);
    setIsHelix(query.matches);
    const onChange = (event: MediaQueryListEvent): void => {
      setIsHelix(event.matches);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const cells = gsap.utils.toArray<HTMLElement>("[data-cell]", scope);
      const rows = gsap.utils.toArray<HTMLElement>("[data-archive-row]", scope);

      const rise = (targets: readonly HTMLElement[]): void => {
        targets.forEach((target) => {
          gsap.fromTo(
            target,
            { opacity: 0, y: RISE_Y },
            {
              opacity: 1,
              y: 0,
              duration: DUR.base,
              ease: EASE.out,
              scrollTrigger: {
                trigger: target,
                start: REVEAL_START,
                once: true,
              },
            },
          );
        });
      };

      const mm = gsap.matchMedia();

      /* Full: the helix owns the platform display (grid is sr-only), so only
       * the archive rows animate here. The helix scrub lives in
       * HelixCarousel. */
      mm.add(MEDIA.full, () => {
        rise(rows);
      });

      /* Lite: simple fade-rises on grid cells and archive rows. No pins. */
      mm.add(MEDIA.lite, () => {
        rise(cells);
        rise(rows);
      });

      /* Reduce: everything static at its final state. */
      mm.add(MEDIA.reduce, () => {
        gsap.set([...cells, ...rows], { clearProps: "opacity,transform" });
      });
    },
    { scope: scopeRef, dependencies: [isHelix], revertOnUpdate: true },
  );

  return (
    <SectionShell anchor={data.anchor} labelledBy={HEADING_ID}>
      <SectionHeading
        eyebrow={data.eyebrow}
        heading={data.heading}
        headingId={HEADING_ID}
      />

      <div ref={scopeRef}>
        {/* GRID: the accessible platform list. Visually hidden, never
            unmounted, while the decorative helix is on stage. */}
        <div
          className={cn(
            isHelix
              ? cn(
                  "sr-only",
                  "focus-within:not-sr-only focus-within:fixed",
                  "focus-within:bottom-6 focus-within:left-6 focus-within:z-[75]",
                  "focus-within:block focus-within:max-h-[60vh]",
                  "focus-within:w-[min(420px,90vw)] focus-within:overflow-y-auto",
                  "focus-within:border focus-within:border-line-strong",
                  "focus-within:bg-ink focus-within:p-6",
                )
              : "mt-16 md:mt-24",
            "group/platgrid",
          )}
        >
          <ul className="grid gap-px bg-line sm:grid-cols-2 group-focus-within/platgrid:grid-cols-1">
            {data.platforms.map((platform) => (
              <li key={platform.title} data-cell className="bg-canvas p-8">
                <PlatformCard platform={platform} />
              </li>
            ))}
          </ul>
        </div>

        {/* HELIX: full tier only, full bleed, aria-hidden inside. */}
        {isHelix ? (
          <div className="-mx-6 mt-16 md:-mx-12 md:mt-24 lg:-mx-20">
            <HelixCarousel platforms={data.platforms} />
          </div>
        ) : null}

        {/* ARCHIVE BAND: text-only research ledger, all tiers. */}
        <div className="mt-20 md:mt-28">
          <p className="eyebrow">{data.archiveLabel}</p>
          <div className="mt-6">
            {data.archive.map((item) => (
              <ArchiveRow key={item.title} item={item} />
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
