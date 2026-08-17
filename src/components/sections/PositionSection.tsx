"use client";

import { useRef } from "react";
import type { PositionContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface PositionSectionProps {
  readonly data: PositionContent;
}

const HEADING_ID = "position-heading";
const RISE_Y = 28;
const RISE_STAGGER = 0.12;
const RISE_START = "top 80%";
const RULE_START = "top 75%";

/* Chapter 02, The Position. The quiet chapter between the hero and the
 * pinned Desk: a large lead statement beside a narrow column of body copy,
 * separated by a vertical hairline that draws in on desktop. */
export function PositionSection({ data }: PositionSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const rises = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
      const rule = scope.querySelector<HTMLElement>("[data-rule]");

      const riseIn = () => {
        if (rises.length === 0) return;
        gsap.fromTo(
          rises,
          { opacity: 0, y: RISE_Y },
          {
            opacity: 1,
            y: 0,
            duration: DUR.base,
            ease: EASE.out,
            stagger: RISE_STAGGER,
            scrollTrigger: {
              trigger: scope,
              start: RISE_START,
              once: true,
            },
          },
        );
      };

      const mm = gsap.matchMedia();

      /* Full: staggered rise plus the vertical hairline drawing in. */
      mm.add(MEDIA.full, () => {
        riseIn();
        if (rule) {
          gsap.fromTo(
            rule,
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              duration: DUR.slow,
              ease: EASE.inOut,
              scrollTrigger: {
                trigger: scope,
                start: RULE_START,
                once: true,
              },
            },
          );
        }
      });

      /* Lite: the same simple rise, no hairline animation, no pins. */
      mm.add(MEDIA.lite, () => {
        riseIn();
      });

      /* Reduce: everything static at its final state. */
      mm.add(MEDIA.reduce, () => {
        gsap.set(rises, { clearProps: "opacity,transform" });
        if (rule) {
          gsap.set(rule, { clearProps: "transform" });
        }
      });
    },
    { scope: scopeRef },
  );

  return (
    <SectionShell anchor={data.anchor} labelledBy={HEADING_ID}>
      <SectionHeading
        eyebrow={data.eyebrow}
        heading={data.heading}
        headingId={HEADING_ID}
      />
      <div
        ref={scopeRef}
        className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-16"
      >
        <p
          data-rise
          className="max-w-[24ch] text-2xl leading-snug text-fg md:text-4xl"
        >
          {data.lead}
        </p>
        <div
          aria-hidden="true"
          data-rule
          className="hidden w-px self-stretch bg-line lg:block"
        />
        <div className="space-y-6">
          {data.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              data-rise
              className="max-w-[42ch] leading-relaxed text-muted"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
