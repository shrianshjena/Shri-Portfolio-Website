"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import type { PhotoBand, RecordContent, RecordRole } from "@/content/types";
import { gsap, useGSAP } from "@/lib/gsap";
import { DUR, EASE, MEDIA } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { SectionShell } from "@/components/ui/SectionShell";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { Decode } from "@/components/fx/Decode";

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

/* Decode cascade inside each row: the period leads, role and summary
 * follow, bullets trail one step apart. Bullet copy decodes on desktop
 * only (tiers="full"); everywhere else it stays a plain reveal. */
const ROLE_DECODE_DELAY_S = 0.1;
const LINE_DECODE_DELAY_S = 0.25;
const BULLET_DECODE_BASE_S = 0.45;
const BULLET_DECODE_STEP_S = 0.12;
const BULLET_DECODE_MAX_S = 1.2;

/* Ledger imagery: intrinsic dimensions per orientation, responsive size
 * hints, and the left-to-right wipe geometry (echoes the decode
 * direction). A "portrait" src marks the 3:4 asset; the rest are 16:10. */
const PORTRAIT_SRC_HINT = "portrait";
const PORTRAIT_WIDTH = 800;
const PORTRAIT_HEIGHT = 1067;
const LANDSCAPE_WIDTH = 1000;
const LANDSCAPE_HEIGHT = 625;
const MEDIA_SIZES =
  "(min-width: 1024px) 300px, (min-width: 768px) 420px, 100vw";
const MEDIA_CLIP_HIDDEN = "inset(0 100% 0 0)";
const MEDIA_CLIP_SHOWN = "inset(0 0 0 0)";
const MEDIA_SCALE_FROM = 1.06;

/* One row of the employment ledger: period rail on the left, company,
 * role, summary line and "+" prefixed bullets in the middle, and an
 * optional evidence image (right rail on desktop, below the text block
 * on smaller screens). The company name rises plain with the wrapper;
 * everything else decodes in a cascade. GSAP owns clip-path on the
 * figure and transform on the img; the CSS hover transition touches
 * filter only (one engine per property). */
function LedgerRow({ role }: LedgerRowProps) {
  const isPortrait = role.image?.src.includes(PORTRAIT_SRC_HINT) ?? false;

  return (
    <article
      data-row
      className="hairline-t grid grid-cols-1 gap-6 py-10 md:grid-cols-[200px_1fr] lg:grid-cols-[180px_minmax(0,1fr)_minmax(240px,300px)] lg:gap-10"
    >
      <Decode as="p" className="eyebrow text-muted">
        {role.period}
      </Decode>
      <div>
        <h3 className="text-xl uppercase tracking-wide text-fg md:text-2xl">
          {role.company}
        </h3>
        <Decode
          as="p"
          delay={ROLE_DECODE_DELAY_S}
          className="eyebrow mt-1 text-steel"
        >
          {role.role}
        </Decode>
        <Decode
          as="p"
          reserveLayout
          delay={LINE_DECODE_DELAY_S}
          className="mt-3 max-w-[60ch] leading-relaxed text-muted"
        >
          {role.line}
        </Decode>
        {role.bullets.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {role.bullets.map((bullet, bulletIndex) => (
              <li
                key={bullet}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span aria-hidden="true" className="mono-nums text-steel">
                  +
                </span>
                <Decode
                  as="span"
                  reserveLayout
                  tiers="full"
                  delay={
                    BULLET_DECODE_BASE_S + bulletIndex * BULLET_DECODE_STEP_S
                  }
                  maxDuration={BULLET_DECODE_MAX_S}
                  className="max-w-[64ch]"
                >
                  {bullet}
                </Decode>
              </li>
            ))}
          </ul>
        ) : null}
        {role.links?.length || role.crossRef ? (
          <div className="mt-6 flex flex-wrap items-center gap-6">
            {role.links?.map((link) => (
              <ArrowLink
                key={link.href}
                href={link.href}
                external={link.external}
              >
                {link.label}
              </ArrowLink>
            ))}
            {role.crossRef ? (
              <a href="#desk" data-cursor="link" className="inline-block">
                <Badge tone="steel">{role.crossRef}</Badge>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
      {role.image ? (
        <figure
          data-media
          className={cn(
            "w-full overflow-hidden md:col-start-2 md:max-w-[420px] lg:col-start-3 lg:row-start-1 lg:max-w-none lg:self-start",
            isPortrait ? "aspect-[3/4] max-h-[70svh]" : "aspect-[16/10]",
          )}
        >
          <Image
            src={role.image.src}
            alt={role.image.alt}
            width={isPortrait ? PORTRAIT_WIDTH : LANDSCAPE_WIDTH}
            height={isPortrait ? PORTRAIT_HEIGHT : LANDSCAPE_HEIGHT}
            sizes={MEDIA_SIZES}
            className="h-full w-full object-cover grayscale-[30%] transition-[filter] duration-500 hover:grayscale-0"
          />
        </figure>
      ) : null}
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
 * offshore photo band. Rows rise in once on enter (full + lite) and the
 * row copy decodes in a cascade; ledger images wipe in left-to-right on
 * the full tier (lite: they join the row rise; reduce: static). The band
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
      const mediaWraps = gsap.utils.toArray<HTMLElement>(
        "[data-media]",
        scope,
      );
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

      /* Full: row reveals, ledger image wipes (clip-path on the wrapper,
       * settle-scale on the img), and the scrubbed photo parallax. */
      mm.add(MEDIA.full, () => {
        riseRows();
        mediaWraps.forEach((wrap) => {
          const img = wrap.querySelector("img");
          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: wrap,
              start: ROW_START,
              once: true,
            },
          });
          reveal.fromTo(
            wrap,
            { clipPath: MEDIA_CLIP_HIDDEN },
            {
              clipPath: MEDIA_CLIP_SHOWN,
              duration: DUR.slow,
              ease: EASE.inOut,
            },
            0,
          );
          if (img) {
            reveal.fromTo(
              img,
              { scale: MEDIA_SCALE_FROM },
              { scale: 1, duration: DUR.slow, ease: EASE.inOut },
              0,
            );
          }
        });
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

      /* Lite: simple row rises only; images join the row rise, no wipes,
       * no scrubs, no pins. */
      mm.add(MEDIA.lite, () => {
        riseRows();
      });

      /* Reduce: everything static at its final state. */
      mm.add(MEDIA.reduce, () => {
        gsap.set(rows, { clearProps: "opacity,transform" });
        if (mediaWraps.length > 0) {
          gsap.set(mediaWraps, { clearProps: "clipPath" });
        }
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
