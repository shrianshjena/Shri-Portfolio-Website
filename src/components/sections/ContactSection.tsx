"use client";

import { useRef } from "react";
import type { ContactContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "@/components/sections/ContactForm";

interface ContactSectionProps {
  readonly data: ContactContent;
}

const HEADING_ID = "contact-heading";
const RISE_Y = 28;
const RISE_STAGGER = 0.12;
const RISE_START = "top 80%";
const RULE_START = "top 75%";

/* Chapter 08, The Market Is Open. Closing chapter: lead and direct channels
 * on the left, the form on the right, split by a vertical hairline that
 * draws in on desktop. Scroll motion owns the [data-rise] wrappers only;
 * hover motion lives on inner elements (one engine per property). */
export function ContactSection({ data }: ContactSectionProps) {
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
        className="mt-16 grid gap-14 md:mt-24 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-16"
      >
        <div className="space-y-12">
          <p
            data-rise
            className="max-w-[38ch] text-lg leading-relaxed text-muted"
          >
            {data.lead}
          </p>
          <div data-rise>
            <p className="eyebrow text-muted">{data.ctaLabel}</p>
            <a
              href={`mailto:${data.email}`}
              data-cursor="link"
              className="mono-nums mt-4 inline-block break-all text-xl lowercase text-fg underline-offset-8 hover:underline md:text-3xl"
            >
              {data.email}
            </a>
            <a
              href={`tel:${data.phone}`}
              data-cursor="link"
              className="eyebrow mt-5 block w-fit transition-colors hover:text-fg"
            >
              {data.phoneDisplay}
            </a>
          </div>
        </div>
        <div
          aria-hidden="true"
          data-rule
          className="hidden w-px self-stretch bg-line lg:block"
        />
        <div data-rise className="relative">
          <ContactForm data={data} />
        </div>
      </div>
    </SectionShell>
  );
}
