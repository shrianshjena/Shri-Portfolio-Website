"use client";

import { useRef } from "react";
import type { ContactContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { DECODE_MAX_S } from "@/lib/constants";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Decode } from "@/components/fx/Decode";
import { ContactForm } from "@/components/sections/ContactForm";

interface ContactSectionProps {
  readonly data: ContactContent;
}

const HEADING_ID = "contact-heading";
const RISE_Y = 28;
const RISE_STAGGER = 0.12;
const RISE_START = "top 80%";
const RULE_START = "top 75%";
/* Status-dot pulse: one slow instrument blink on full and lite; static
 * under reduced motion. GSAP owns the dot's transform and opacity. Bounded
 * to a single yoyo cycle (2 x 2.4s = 4.8s), so it stays under the 5s
 * automatic-motion threshold of WCAG 2.2.2 without needing a pause
 * control, and settles back at the rest state. */
const PULSE_DUR_S = 2.4;
const PULSE_SCALE = 1.15;
const PULSE_MIN_OPACITY = 0.6;

/* Chapter 09, The Market Is Open. Closing chapter: status rail, lead and
 * direct channels on the left, the form on the right, split by a vertical
 * hairline that draws in on desktop. Scroll motion owns the [data-rise]
 * wrappers and the [data-pulse] dot only; hover motion lives on inner
 * elements and the Decode passes animate text content, never color, so CSS
 * hover color transitions stay collision-free (one engine per property). */
export function ContactSection({ data }: ContactSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const rises = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
      const rule = scope.querySelector<HTMLElement>("[data-rule]");
      const pulse = scope.querySelector<HTMLElement>("[data-pulse]");

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

      const pulseIn = () => {
        if (!pulse) return;
        gsap.to(pulse, {
          scale: PULSE_SCALE,
          opacity: PULSE_MIN_OPACITY,
          duration: PULSE_DUR_S,
          ease: EASE.soft,
          repeat: 1,
          yoyo: true,
        });
      };

      const mm = gsap.matchMedia();

      /* Full: staggered rise, pulsing status dot, vertical hairline draw. */
      mm.add(MEDIA.full, () => {
        riseIn();
        pulseIn();
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

      /* Lite: the same simple rise plus the pulse, no hairline animation,
       * no pins. */
      mm.add(MEDIA.lite, () => {
        riseIn();
        pulseIn();
      });

      /* Reduce: everything static at its final state. */
      mm.add(MEDIA.reduce, () => {
        gsap.set(rises, { clearProps: "opacity,transform" });
        if (rule) {
          gsap.set(rule, { clearProps: "transform" });
        }
        if (pulse) {
          gsap.set(pulse, { clearProps: "transform,opacity" });
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
        className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-16"
      >
        <div className="space-y-12">
          <div data-rise className="flex items-center gap-3">
            <span
              aria-hidden="true"
              data-pulse
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-steel"
            />
            <Decode className="eyebrow">{data.statusLine}</Decode>
          </div>
          <div data-rise>
            <Decode
              as="p"
              reserveLayout
              maxDuration={DECODE_MAX_S}
              tiers="both"
              className="max-w-[38ch] text-lg leading-relaxed text-muted"
            >
              {data.lead}
            </Decode>
          </div>
          <div data-rise>
            <p className="eyebrow text-muted">{data.ctaLabel}</p>
            <a
              href={`mailto:${data.email}`}
              data-cursor="link"
              className="mono-nums mt-4 inline-block break-all text-xl lowercase text-fg underline-offset-8 hover:underline md:text-3xl"
            >
              <Decode tiers="both">{data.email}</Decode>
            </a>
            <a
              href={`tel:${data.phone}`}
              data-cursor="link"
              className="eyebrow mt-5 block w-fit transition-colors hover:text-fg"
            >
              <Decode tiers="both">{data.phoneDisplay}</Decode>
            </a>
          </div>
        </div>
        <div
          aria-hidden="true"
          data-rule
          className="hidden w-px self-stretch bg-line lg:block"
        />
        <div className="relative">
          <ContactForm data={data} />
        </div>
      </div>
    </SectionShell>
  );
}
