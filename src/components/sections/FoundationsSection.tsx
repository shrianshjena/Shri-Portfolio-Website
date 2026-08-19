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
import { RailHeader } from "@/components/ui/RailHeader";
import { Decode } from "@/components/fx/Decode";
import { CountUp } from "@/components/fx/CountUp";
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

/* Splits a detail string ("8.6 CGPA", "85%") into a numeric value for
 * CountUp plus its literal suffix. Decimals mirror the source string so
 * the count-up formats 8.6 as one decimal and 85 as none. */
const DETAIL_PATTERN = /^([\d.]+)(.*)$/;

interface ParsedDetail {
  readonly value: number;
  readonly decimals: number;
  readonly suffix: string;
}

function parseDetail(detail: string): ParsedDetail | null {
  const match = DETAIL_PATTERN.exec(detail);
  if (!match) return null;
  const value = Number(match[1]);
  if (Number.isNaN(value)) return null;
  const dotIndex = match[1].indexOf(".");
  const decimals = dotIndex === -1 ? 0 : match[1].length - dotIndex - 1;
  return { value, decimals, suffix: match[2] };
}

/* Chapter 07, Foundations. Education and certifications as one calm
 * typographic viewport: two hairline-ruled columns, no images, no cards.
 * All three education numbers count up at the same instrument scale; the
 * degree row keeps the section's single accent-number moment, the other
 * two read in steel. */
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

      /* Full only: each row's top hairline draws left to right alongside
       * the rise. The set-to-0 lives inside this branch, so no-JS, lite
       * and reduce keep the server-rendered line at full width. */
      const drawHairlines = () => {
        const rows = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
        rows.forEach((row) => {
          const hairline = row.querySelector<HTMLElement>("[data-hairline]");
          if (!hairline) return;
          gsap.fromTo(
            hairline,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: DUR.base,
              ease: EASE.inOut,
              scrollTrigger: {
                trigger: row,
                start: RISE_START,
                once: true,
              },
            },
          );
        });
      };

      const mm = gsap.matchMedia();

      /* Full: staggered row rise plus hairline draws. No pins or scrubs,
       * this chapter stays quiet. */
      mm.add(MEDIA.full, () => {
        riseIn();
        drawHairlines();
      });

      /* Lite: identical simple rise, hairlines stay untransformed. */
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
          <div data-rise>
            <RailHeader label={EDUCATION_LABEL} as="h3" />
          </div>
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
          <div data-rise>
            <RailHeader label={CERTIFICATIONS_LABEL} as="h3" />
          </div>
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

/* Decorative top rule, drawn by GSAP on the full tier only. Server renders
 * it at natural scale so it is always present without JavaScript. */
function RowHairline() {
  return (
    <span
      aria-hidden="true"
      data-hairline
      className="absolute inset-x-0 top-0 h-px origin-left bg-line"
    />
  );
}

interface EducationRowProps {
  readonly entry: EducationEntry;
  readonly featured: boolean;
}

function EducationRow({ entry, featured }: EducationRowProps) {
  const parsed = parseDetail(entry.detail);
  return (
    <li
      data-rise
      className="relative grid grid-cols-[1fr_auto] items-start gap-4 py-6"
    >
      <RowHairline />
      <div>
        <Decode
          as="p"
          tiers="both"
          reserveLayout
          className="text-base uppercase text-fg md:text-lg"
        >
          {entry.institution}
        </Decode>
        <p className="eyebrow mt-1 text-steel">{entry.credential}</p>
        <p
          className={cn(
            "mono-nums mt-3 text-2xl",
            featured ? "text-accent" : "text-steel",
          )}
        >
          {parsed ? (
            <CountUp
              value={parsed.value}
              decimals={parsed.decimals}
              suffix={parsed.suffix}
            />
          ) : (
            entry.detail
          )}
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
      className="relative grid grid-cols-[1fr_auto] items-center gap-4 py-5"
    >
      <RowHairline />
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
