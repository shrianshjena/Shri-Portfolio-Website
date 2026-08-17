"use client";

import { useRef } from "react";
import type { LoopContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { DIAL_MAX_ROTATION_DEG } from "@/lib/constants";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  LoopDial,
  formatDialReadout,
  padTwo,
} from "@/components/sections/LoopDial";
import { cn } from "@/lib/cn";

/*
 * Chapter 06, THE LOOP. Scroll-rotation instrument dial + skills telemetry.
 *
 * Tiers:
 *   full   the tick ring scrubs a full 360deg rotation across the section
 *          scroll, and the active detent (floor(progress * count)) is
 *          tracked React-free via data-active attributes: the active label
 *          brightens to fg and only its description stays visible.
 *   lite   same scrub capped at 120deg, no active tracking, all five
 *          detent descriptions visible, simple rise-ins.
 *   reduce static dial, everything visible at final state, no scrubs.
 */

export interface LoopSectionProps {
  readonly data: LoopContent;
}

const HEADING_ID = "loop-heading";
const LITE_ROTATION_DEG = 120;
const DIAL_SCRUB = 1.5;
const DIAL_START = "top bottom";
const DIAL_END = "bottom top";
const RISE_Y = 28;
const RISE_STAGGER = 0.1;
const RISE_START = "top 80%";

export function LoopSection({ data }: LoopSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const ring = scope.querySelector<HTMLElement>("[data-dial-ring]");
      const readout = scope.querySelector<HTMLElement>("[data-dial-readout]");
      const detentEls = gsap.utils.toArray<HTMLElement>("[data-detent]", scope);
      const rises = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
      const skillGroups = gsap.utils.toArray<HTMLElement>(
        "[data-skill-rise]",
        scope,
      );

      const riseIn = (targets: readonly HTMLElement[]) => {
        if (targets.length === 0) return;
        gsap.fromTo(
          targets,
          { opacity: 0, y: RISE_Y },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            stagger: RISE_STAGGER,
            scrollTrigger: { trigger: targets[0], start: RISE_START, once: true },
          },
        );
      };

      const mm = gsap.matchMedia();

      /* Full: 360deg tick-ring scrub + React-free active detent tracking. */
      mm.add(MEDIA.full, () => {
        riseIn(rises);
        riseIn(skillGroups);

        const total = detentEls.length;
        let activeIndex = -1;

        const applyActive = (index: number) => {
          activeIndex = index;
          detentEls.forEach((el, i) => {
            el.dataset.active = i === index ? "true" : "false";
          });
          if (readout) {
            readout.textContent = formatDialReadout(index + 1, total);
          }
        };

        if (total > 0) {
          applyActive(0);
        }

        if (ring) {
          gsap.to(ring, {
            rotation: DIAL_MAX_ROTATION_DEG,
            ease: EASE.none,
            transformOrigin: "50% 50%",
            scrollTrigger: {
              trigger: scope,
              start: DIAL_START,
              end: DIAL_END,
              scrub: DIAL_SCRUB,
              onUpdate: (self) => {
                if (total === 0) return;
                const next = Math.min(
                  total - 1,
                  Math.max(0, Math.floor(self.progress * total)),
                );
                if (next !== activeIndex) {
                  applyActive(next);
                }
              },
            },
          });
        }

        /* Restore the tier-neutral state (all detents visible) on revert. */
        return () => {
          detentEls.forEach((el) => {
            delete el.dataset.active;
          });
          if (readout && total > 0) {
            readout.textContent = formatDialReadout(1, total);
          }
        };
      });

      /* Lite: shallow 120deg scrub, no active tracking, no pins. */
      mm.add(MEDIA.lite, () => {
        riseIn(rises);
        riseIn(skillGroups);
        if (ring) {
          gsap.to(ring, {
            rotation: LITE_ROTATION_DEG,
            ease: EASE.none,
            transformOrigin: "50% 50%",
            scrollTrigger: {
              trigger: scope,
              start: DIAL_START,
              end: DIAL_END,
              scrub: DIAL_SCRUB,
            },
          });
        }
      });

      /* Reduce: everything static at its final visible state. */
      mm.add(MEDIA.reduce, () => {
        gsap.set([...rises, ...skillGroups], { clearProps: "opacity,transform" });
        if (ring) {
          gsap.set(ring, { clearProps: "transform" });
        }
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

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-2 lg:gap-20">
          {/* LEFT: intro, instrument dial, detent list. */}
          <div>
            <p data-rise className="max-w-[46ch] leading-relaxed text-muted">
              {data.intro}
            </p>

            <div data-rise className="mt-12">
              <LoopDial detentCount={data.detents.length} />
            </div>

            <ol data-rise className="mt-12">
              {data.detents.map((detent, index) => (
                <li
                  key={detent.label}
                  data-detent
                  className="group/detent hairline-t flex gap-4 py-5"
                >
                  <span
                    aria-hidden="true"
                    className="mono-nums w-6 shrink-0 pt-px text-[10px] tracking-[0.22em] text-steel"
                  >
                    {padTwo(index + 1)}
                  </span>
                  <div>
                    <p
                      className={cn(
                        "mono-nums text-[11px] uppercase tracking-[0.22em] text-muted",
                        "transition-colors duration-300",
                        "group-data-[active=true]/detent:text-fg",
                      )}
                    >
                      {detent.label}
                    </p>
                    <p
                      className={cn(
                        "mt-2 max-w-[40ch] text-sm leading-relaxed text-muted",
                        "transition-opacity duration-300",
                        "group-data-[active=false]/detent:opacity-0",
                      )}
                    >
                      {detent.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* RIGHT: skills telemetry grid. */}
          <div className="grid content-start gap-x-10 gap-y-12 sm:grid-cols-2">
            {data.skills.map((group) => (
              <div key={group.category} data-skill-rise>
                <h3 className="eyebrow hairline-b pb-2 text-steel">
                  {group.category}
                </h3>
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="mono-nums text-[11px] uppercase tracking-[0.15em] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
