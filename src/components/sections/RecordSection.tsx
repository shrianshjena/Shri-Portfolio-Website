"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import type { PhotoBand, RecordContent, RecordRole } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";

interface RecordSectionProps {
  readonly data: RecordContent;
}

interface LedgerRowProps {
  readonly role: RecordRole;
}

interface PhotoBandFigureProps {
  readonly band: PhotoBand;
}

const HEADING_ID = "record-heading";
const PHOTO_AFTER_COMPANY = "SOLAS";
const ROW_RISE_Y = 32;
const ROW_START = "top 85%";
const PARALLAX_RANGE = 8;

/* One row of the employment ledger: period rail on the left, company,
 * role, summary line and "+" prefixed bullets on the right. */
function LedgerRow({ role }: LedgerRowProps) {
  return (
    <article
      data-row
      className="hairline-t grid grid-cols-1 gap-6 py-10 md:grid-cols-[200px_1fr]"
    >
      <p className="eyebrow text-muted">{role.period}</p>
      <div>
        <h3 className="text-xl uppercase tracking-wide text-fg md:text-2xl">
          {role.company}
        </h3>
        <p className="eyebrow mt-1 text-steel">{role.role}</p>
        <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">
          {role.line}
        </p>
        {role.bullets.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {role.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span aria-hidden="true" className="mono-nums text-steel">
                  +
                </span>
                <span className="max-w-[64ch]">{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {role.link || role.crossRef ? (
          <div className="mt-6 flex flex-wrap items-center gap-6">
            {role.link ? (
              <ArrowLink href={role.link.href} external={role.link.external}>
                {role.link.label}
              </ArrowLink>
            ) : null}
            {role.crossRef ? (
              <a href="#desk" data-cursor="link" className="inline-block">
                <Badge tone="steel">{role.crossRef}</Badge>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

/* Full-bleed vessel photo band: environmental evidence, not a portrait.
 * Escapes the SectionShell gutters, duotone ink scrim over a desaturated
 * frame, mono caption pinned to the lower left. The inner wrapper is
 * oversized so the full-tier parallax never reveals an edge. */
function PhotoBandFigure({ band }: PhotoBandFigureProps) {
  return (
    <figure
      data-band
      className="hairline-t hairline-b relative -mx-6 h-[45vh] min-h-[320px] overflow-hidden md:-mx-12 lg:-mx-20"
    >
      <div data-parallax className="absolute inset-x-0 -top-[10%] h-[120%]">
        <Image
          src={band.src}
          alt={band.alt}
          fill
          sizes="100vw"
          className="object-cover object-[center_30%] brightness-110 grayscale-[30%]"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-ink-2/35 mix-blend-multiply"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-canvas/80 to-transparent"
      />
      <figcaption className="eyebrow absolute bottom-4 left-6 md:left-12">
        {band.caption}
      </figcaption>
    </figure>
  );
}

/* Chapter 04, The Record. A vertical employment ledger, one hairline row
 * per role, interrupted after the SOLAS MODU entry by the full-bleed
 * offshore photo band. Rows rise in once on enter (full + lite); the band
 * gets a scrubbed vertical parallax on the full tier only. */
export function RecordSection({ data }: RecordSectionProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const photoIndex = data.roles.findIndex((role) =>
    role.company.includes(PHOTO_AFTER_COMPANY),
  );

  useGSAP(
    () => {
      const scope = scopeRef.current;
      if (!scope) return;

      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", scope);
      const band = scope.querySelector<HTMLElement>("[data-band]");
      const parallax = scope.querySelector<HTMLElement>("[data-parallax]");

      const riseRows = () => {
        rows.forEach((row) => {
          gsap.fromTo(
            row,
            { opacity: 0, y: ROW_RISE_Y },
            {
              opacity: 1,
              y: 0,
              duration: DUR.base,
              ease: EASE.out,
              scrollTrigger: {
                trigger: row,
                start: ROW_START,
                once: true,
              },
            },
          );
        });
      };

      const mm = gsap.matchMedia();

      /* Full: row reveals plus the scrubbed photo parallax. */
      mm.add(MEDIA.full, () => {
        riseRows();
        if (band && parallax) {
          gsap.fromTo(
            parallax,
            { yPercent: -PARALLAX_RANGE },
            {
              yPercent: PARALLAX_RANGE,
              ease: EASE.none,
              scrollTrigger: {
                trigger: band,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      /* Lite: simple row rises only, no scrubs, no pins. */
      mm.add(MEDIA.lite, () => {
        riseRows();
      });

      /* Reduce: everything static at its final state. */
      mm.add(MEDIA.reduce, () => {
        gsap.set(rows, { clearProps: "opacity,transform" });
        if (parallax) {
          gsap.set(parallax, { clearProps: "transform" });
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
      <div ref={scopeRef} className="mt-16 md:mt-24">
        {data.roles.map((role, index) => (
          <Fragment key={role.company}>
            <LedgerRow role={role} />
            {index === photoIndex ? (
              <PhotoBandFigure band={data.photoBand} />
            ) : null}
          </Fragment>
        ))}
      </div>
    </SectionShell>
  );
}
