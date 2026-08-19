"use client";

import { useRef } from "react";
import Image from "next/image";
import type { PositionContent } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Decode } from "@/components/fx/Decode";

interface PositionSectionProps {
  readonly data: PositionContent;
}

const HEADING_ID = "position-heading";
const RISE_Y = 28;
const RISE_STAGGER = 0.12;
const RISE_START = "top 80%";
const RULE_START = "top 75%";
const FIGURE_START = "top 85%";
const FIGURE_CLIP_HIDDEN = "inset(0 0 100% 0)";
const FIGURE_CLIP_SHOWN = "inset(0 0 0% 0)";
const FIGURE_IMAGE_FROM_SCALE = 1.06;
const BODY_DECODE_DELAY_S = 0.15;
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 1067;
const IMAGE_SIZES = "(min-width: 1024px) 40vw, 100vw";

/* Structural log label ("LOG 01".."LOG 04") built from the paragraph index. */
function logLabel(index: number): string {
  return `LOG ${String(index + 1).padStart(2, "0")}`;
}

/* Chapter 02, The Position. Portrait on the left, the vertical hairline that
 * draws in on desktop, then the lead statement and four log-entry paragraphs
 * decoding on the right. Below lg the portrait stacks first, full width. */
export function PositionSection({ data }: PositionSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const rises = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
      const rule = scope.querySelector<HTMLElement>("[data-rule]");
      const figure = scope.querySelector<HTMLElement>("[data-figure]");
      const figureImage = figure?.querySelector("img") ?? null;

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
            scrollTrigger: {
              trigger: scope,
              start: RISE_START,
              once: true,
            },
          },
        );
      };

      const mm = gsap.matchMedia();

      /* Full: staggered rise, hairline draw, and the portrait revealed by a
       * clip-path wipe while the inner frame settles from a slight
       * overscale. GSAP owns clip-path (figure) and transform (img); the
       * CSS hover transition owns filter only, so no property is driven by
       * two engines. */
      mm.add(MEDIA.full, () => {
        riseIn(rises);
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
        if (figure && figureImage) {
          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: figure,
              start: FIGURE_START,
              once: true,
            },
          });
          reveal.fromTo(
            figure,
            { clipPath: FIGURE_CLIP_HIDDEN },
            {
              clipPath: FIGURE_CLIP_SHOWN,
              duration: DUR.slow,
              ease: EASE.inOut,
            },
            0,
          );
          reveal.fromTo(
            figureImage,
            { scale: FIGURE_IMAGE_FROM_SCALE },
            { scale: 1, duration: DUR.slow, ease: EASE.inOut },
            0,
          );
        }
      });

      /* Lite: the figure joins the simple rise; no hairline, no clip wipe. */
      mm.add(MEDIA.lite, () => {
        riseIn(figure ? [figure, ...rises] : rises);
      });

      /* Reduce: everything static at its final state. */
      mm.add(MEDIA.reduce, () => {
        const staticTargets = [
          ...rises,
          ...(figure ? [figure] : []),
          ...(figureImage ? [figureImage] : []),
        ];
        gsap.set(staticTargets, { clearProps: "opacity,transform,clipPath" });
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
        className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.1fr)] lg:gap-16"
      >
        <figure data-figure className="overflow-hidden">
          <Image
            src={data.image.src}
            alt={data.image.alt}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            sizes={IMAGE_SIZES}
            className="aspect-[3/4] max-h-[60svh] w-full object-cover grayscale-[30%] transition-[filter] duration-500 hover:grayscale-0 lg:max-h-none"
          />
        </figure>
        <div
          aria-hidden="true"
          data-rule
          className="hidden w-px self-stretch bg-line lg:block"
        />
        <div>
          <Decode
            as="p"
            reserveLayout
            className="max-w-[24ch] text-2xl leading-snug text-fg md:text-4xl"
          >
            {data.lead}
          </Decode>
          <div className="mt-12 space-y-9">
            {data.paragraphs.map((paragraph, index) => (
              <article
                key={paragraph}
                data-rise
                className="grid grid-cols-[5px_minmax(0,1fr)] items-center gap-x-3"
              >
                <span
                  aria-hidden="true"
                  className="h-[5px] w-[5px] rounded-full border border-steel"
                />
                <Decode as="p" delay={0} className="eyebrow">
                  {logLabel(index)}
                </Decode>
                <Decode
                  as="p"
                  reserveLayout
                  tiers="full"
                  delay={BODY_DECODE_DELAY_S}
                  className="col-start-2 mt-3 max-w-[42ch] leading-relaxed text-muted"
                >
                  {paragraph}
                </Decode>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
