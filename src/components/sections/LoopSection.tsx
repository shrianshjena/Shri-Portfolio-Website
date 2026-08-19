"use client";

import { useEffect, useRef, useState } from "react";
import type { LoopContent } from "@/content/types";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { DIAL_SPIN_LITE_S, DIAL_SPIN_S } from "@/lib/constants";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RailHeader } from "@/components/ui/RailHeader";
import { Decode } from "@/components/fx/Decode";
import {
  LoopDial,
  formatDialReadout,
  padTwo,
} from "@/components/sections/LoopDial";
import { cn } from "@/lib/cn";

/*
 * Chapter 06, THE LOOP. Autonomous instrument dial + skills telemetry.
 *
 * Tiers:
 *   full   the tick ring spins continuously (360deg per DIAL_SPIN_S) and
 *          the active detent advances on time (dwell = spin / detent
 *          count), tracked React-free via data-active attributes; a
 *          lg-only sounding line between the columns scrubs its scaleY
 *          draw with a steel dot riding the tip; skill items cascade
 *          per-item.
 *   lite   same continuous spin at DIAL_SPIN_LITE_S with the same timed
 *          detent cycling; the sounding line is a static hairline;
 *          simple rise-ins.
 *   reduce static dial, no detent cycling (all rows equal), everything
 *          visible at final state.
 *
 * The spin tween is parked offscreen: a non-scrub ScrollTrigger spanning
 * the section plays it while any part is in the viewport and pauses it
 * otherwise. A visible HOLD/RUN control under the dial (mirroring
 * TickerMarquee) satisfies WCAG 2.2.2: holding pauses the spin and freezes
 * detent cycling on both spinning tiers, and hold wins over the park
 * trigger; releasing RUN offscreen waits for the section to scroll back
 * in. The reduce tier is static, so the control is motion-reduce:hidden.
 * All five detent descriptions stay readable on every tier; the active
 * row only brightens (label to fg, ring bullet fills steel).
 */

export interface LoopSectionProps {
  readonly data: LoopContent;
}

const HEADING_ID = "loop-heading";
const DIAL_PARK_START = "top bottom";
const DIAL_PARK_END = "bottom top";
const RISE_Y = 28;
const RISE_STAGGER = 0.1;
const SKILL_ITEM_STAGGER = 0.05;
const RISE_START = "top 80%";
const SOUNDING_START = "top 80%";
const SOUNDING_END = "bottom 60%";
const SOUNDING_SCRUB = 0.6;

export function LoopSection({ data }: LoopSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<gsap.core.Tween | null>(null);
  const holdRef = useRef(false);
  /* True while the park ScrollTrigger has the section fully offscreen;
   * starts true so RUN pressed before first toggle cannot start the spin. */
  const parkedRef = useRef(true);
  const [held, setHeld] = useState(false);

  /* HOLD freezes the spin (and with it the timed detent cycling) on both
   * spinning tiers; RUN resumes only when the section is onscreen, the
   * park trigger handles re-entry otherwise. */
  useEffect(() => {
    holdRef.current = held;
    const spin = spinRef.current;
    if (!spin) return;
    if (held) {
      spin.pause();
    } else if (!parkedRef.current) {
      spin.play();
    }
  }, [held]);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const ring = scope.querySelector<HTMLElement>("[data-dial-ring]");
      const readout = scope.querySelector<HTMLElement>("[data-dial-readout]");
      const detentEls = gsap.utils.toArray<HTMLElement>("[data-detent]", scope);
      const rises = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
      const skillItems = gsap.utils.toArray<HTMLElement>(
        "[data-skill-item]",
        scope,
      );
      const total = detentEls.length;

      const riseIn = (
        targets: readonly HTMLElement[],
        stagger: number = RISE_STAGGER,
      ) => {
        if (targets.length === 0) return;
        gsap.fromTo(
          targets,
          { opacity: 0, y: RISE_Y },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            stagger,
            scrollTrigger: {
              trigger: targets[0],
              start: RISE_START,
              once: true,
            },
          },
        );
      };

      /* Continuous ring spin + timed detent cycling (dwell = spin / count).
       * Returns the tier-neutral restore for matchMedia revert. */
      const spinDial = (spinSeconds: number) => {
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
          const spin = gsap.to(ring, {
            rotation: "+=360",
            duration: spinSeconds,
            ease: EASE.none,
            repeat: -1,
            transformOrigin: "50% 50%",
            paused: true,
            onUpdate: () => {
              if (total === 0) return;
              const next = Math.min(
                total - 1,
                Math.floor(
                  ((spin.totalTime() % spinSeconds) / spinSeconds) * total,
                ),
              );
              if (next !== activeIndex) {
                applyActive(next);
              }
            },
          });
          spinRef.current = spin;

          /* Park the spin while the section is fully offscreen; a live
           * HOLD wins over re-entry (the hold effect resumes on RUN). */
          const syncPark = (self: ScrollTrigger): void => {
            parkedRef.current = !self.isActive;
            if (self.isActive && !holdRef.current) {
              spin.play();
            } else {
              spin.pause();
            }
          };
          ScrollTrigger.create({
            trigger: scope,
            start: DIAL_PARK_START,
            end: DIAL_PARK_END,
            onToggle: syncPark,
            /* onToggle alone misses refreshes that correct this trigger's
             * geometry without flipping isActive (e.g. the helix pin's
             * post-mount sort+refresh); resync on every refresh so the
             * spin never stays paused on a visible dial. */
            onRefresh: syncPark,
          });
        }

        /* Restore the tier-neutral state (all detents equal) on revert. */
        return () => {
          spinRef.current = null;
          parkedRef.current = true;
          detentEls.forEach((el) => {
            delete el.dataset.active;
          });
          if (readout && total > 0) {
            readout.textContent = formatDialReadout(1, total);
          }
        };
      };

      /* lg-only sounding line: scaleY draw, steel dot riding the tip. */
      const drawSoundingLine = () => {
        const line = scope.querySelector<HTMLElement>("[data-sounding-line]");
        const dot = scope.querySelector<HTMLElement>("[data-sounding-dot]");
        if (!line || !dot) return;
        const rail = line.parentElement ?? line;

        gsap.set(dot, { autoAlpha: 1 });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rail,
            start: SOUNDING_START,
            end: SOUNDING_END,
            scrub: SOUNDING_SCRUB,
          },
        });
        tl.fromTo(
          line,
          { scaleY: 0, transformOrigin: "top" },
          { scaleY: 1, ease: EASE.none },
          0,
        ).fromTo(dot, { top: "0%" }, { top: "100%", ease: EASE.none }, 0);
      };

      const mm = gsap.matchMedia();

      /* Full: autonomous spin, timed detents, sounding line, item cascade. */
      mm.add(MEDIA.full, () => {
        riseIn(rises);
        riseIn(skillItems, SKILL_ITEM_STAGGER);
        drawSoundingLine();
        return spinDial(DIAL_SPIN_S);
      });

      /* Lite: slower spin, same timed detents, static hairline. */
      mm.add(MEDIA.lite, () => {
        riseIn(rises);
        riseIn(skillItems, SKILL_ITEM_STAGGER);
        return spinDial(DIAL_SPIN_LITE_S);
      });

      /* Reduce: static dial, no cycling, all rows equal and visible. */
      mm.add(MEDIA.reduce, () => {
        gsap.set([...rises, ...skillItems], {
          clearProps: "opacity,transform",
        });
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

        <div className="mt-16 grid gap-16 md:mt-24 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-20">
          {/* LEFT: intro, instrument dial, detent list. */}
          <div>
            <p data-rise className="max-w-[46ch] leading-relaxed text-muted">
              {data.intro}
            </p>

            <div data-rise className="mt-12">
              <LoopDial detentCount={data.detents.length} />
              {/* WCAG 2.2.2 pause control, mirroring TickerMarquee. The
                  wrapper repeats the dial's width so the button centers
                  under the readout at every breakpoint; the reduce tier
                  is static so the control hides itself. */}
              <div className="mt-6 flex w-[min(70vw,440px)] justify-center">
                <button
                  type="button"
                  onClick={() => setHeld((value) => !value)}
                  aria-pressed={held}
                  aria-label={
                    held ? "Resume dial rotation" : "Pause dial rotation"
                  }
                  data-cursor="link"
                  className="eyebrow shrink-0 border border-line px-3 py-1.5 !text-[9px] text-steel transition-colors hover:border-line-strong motion-reduce:hidden"
                >
                  {held ? "RUN ▸" : "HOLD ⏸"}
                </button>
              </div>
            </div>

            <ol data-rise className="mt-12">
              {data.detents.map((detent, index) => (
                <li
                  key={detent.label}
                  data-detent
                  className="group/detent hairline-t flex gap-4 py-5"
                >
                  {/* Ring bullet: fills steel while the row is active
                      (status-dot exception; CSS color transition only). */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 h-[7px] w-[7px] shrink-0 rounded-full border border-steel",
                      "transition-colors duration-300",
                      "group-data-[active=true]/detent:bg-steel",
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className="mono-nums w-6 shrink-0 pt-px text-[10px] tracking-[0.22em] text-steel"
                  >
                    {padTwo(index + 1)}
                  </span>
                  <div>
                    <Decode
                      as="p"
                      className={cn(
                        "mono-nums text-[11px] uppercase tracking-[0.22em] text-muted",
                        "transition-colors duration-300",
                        "group-data-[active=true]/detent:text-fg",
                      )}
                    >
                      {detent.label}
                    </Decode>
                    <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-muted">
                      {detent.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* CENTER: lg-only sounding line between the columns. */}
          <div
            aria-hidden="true"
            className="relative hidden w-px self-stretch lg:block"
          >
            <div data-sounding-line className="absolute inset-0 bg-line" />
            <div
              data-sounding-dot
              className="absolute left-1/2 top-0 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-steel opacity-0"
            />
          </div>

          {/* RIGHT: skills telemetry grid. */}
          <div className="grid content-start gap-x-10 gap-y-12 sm:grid-cols-2">
            {data.skills.map((group) => (
              <div key={group.category}>
                <RailHeader label={group.category} as="h3" />
                <ul className="mt-4 space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      data-skill-item
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
