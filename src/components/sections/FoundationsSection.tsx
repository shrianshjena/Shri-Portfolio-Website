"use client";

import { useRef } from "react";
import type {
  Certification,
  EducationEntry,
  FoundationsContent,
} from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { cn } from "@/lib/cn";

interface FoundationsSectionProps {
  readonly data: FoundationsContent;
}

const HEADING_ID = "foundations-heading";
const EDUCATION_LABEL = "EDUCATION";
const CERTIFICATIONS_LABEL = "CERTIFICATIONS";
const VERIFY_LABEL = "VERIFY";
const RISE_Y = 24;
const RISE_STAGGER = 0.1;
const RISE_START = "top 82%";

/* Chapter 07, Foundations. Education and certifications as one calm
 * typographic viewport: two hairline-ruled columns, no images, no cards.
 * The degree row carries the single accent-number moment (8.6 CGPA). */
export function FoundationsSection({ data }: FoundationsSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const columns = gsap.utils.toArray<HTMLElement>("[data-col]", scope);

      /* Each column staggers its own rows from its own entry into view, so
       * both desktop columns cascade in parallel and stacked mobile columns
       * reveal as they arrive. Scroll-driven motion owns the row wrappers;
       * hover motion (MagneticButton) owns inner nodes only. */
      const riseIn = () => {
        columns.forEach((column) => {
          const rows = gsap.utils.toArray<HTMLElement>("[data-rise]", column);
          if (rows.length === 0) return;
          gsap.fromTo(
            rows,
            { opacity: 0, y: RISE_Y },
            {
              opacity: 1,
              y: 0,
              duration: DUR.base,
              ease: EASE.out,
              stagger: RISE_STAGGER,
              scrollTrigger: {
                trigger: column,
                start: RISE_START,
                once: true,
              },
            },
          );
        });
      };

      const mm = gsap.matchMedia();

      /* Full: staggered row rise. No pins, this chapter stays quiet. */
      mm.add(MEDIA.full, () => {
        riseIn();
      });

      /* Lite: identical simple rise, no pins. */
      mm.add(MEDIA.lite, () => {
        riseIn();
      });

      /* Reduce: rows static at their final state. */
      mm.add(MEDIA.reduce, () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
        gsap.set(rows, { clearProps: "opacity,transform" });
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
        className="mt-14 grid gap-14 md:mt-20 lg:grid-cols-2 lg:gap-20"
      >
        <div data-col>
          <h3 data-rise className="eyebrow">
            {EDUCATION_LABEL}
          </h3>
          <ul className="mt-6">
            {data.education.map((entry, index) => (
              <EducationRow
                key={entry.institution}
                entry={entry}
                featured={index === 0}
              />
            ))}
          </ul>
        </div>
        <div data-col>
          <h3 data-rise className="eyebrow">
            {CERTIFICATIONS_LABEL}
          </h3>
          <ul className="mt-6">
            {data.certifications.map((certification) => (
              <CertificationRow
                key={certification.title}
                certification={certification}
              />
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

interface EducationRowProps {
  readonly entry: EducationEntry;
  readonly featured: boolean;
}

function EducationRow({ entry, featured }: EducationRowProps) {
  return (
    <li
      data-rise
      className="hairline-t grid grid-cols-[1fr_auto] items-start gap-4 py-6"
    >
      <div>
        <p className="text-base uppercase text-fg md:text-lg">
          {entry.institution}
        </p>
        <p className="eyebrow mt-1 text-steel">{entry.credential}</p>
        <p
          className={cn(
            "mono-nums mt-3 text-accent",
            featured ? "text-2xl" : "text-base",
          )}
        >
          {entry.detail}
        </p>
      </div>
      <p className="eyebrow text-right text-muted">{entry.period}</p>
    </li>
  );
}

interface CertificationRowProps {
  readonly certification: Certification;
}

function CertificationRow({ certification }: CertificationRowProps) {
  return (
    <li
      data-rise
      className="hairline-t grid grid-cols-[1fr_auto] items-center gap-4 py-5"
    >
      <div>
        <p className="text-sm uppercase text-fg md:text-base">
          {certification.title}
        </p>
        <p className="eyebrow mt-1 text-muted">{certification.issuer}</p>
      </div>
      <ArrowLink href={certification.url} external>
        {VERIFY_LABEL}
      </ArrowLink>
    </li>
  );
}
