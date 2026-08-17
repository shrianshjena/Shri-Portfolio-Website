import { Fragment } from "react";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/fx/CountUp";
import { cn } from "@/lib/cn";
import type { DeskPanel as DeskPanelData } from "@/content/types";

/*
 * One card of the horizontal Desk chapter. Layout restyles per motion tier
 * via the named group set on the DeskSection root: data-axis="x" means the
 * horizontal track (full pin or lite swipe strip), otherwise the card is a
 * full-width block in the stacked fallback.
 */

/* Panel ids that receive special status treatment (from SITE.desk data). */
const AMBER_STATUS_PANEL_ID = "compliance-catch";
const PULSE_DOT_PANEL_ID = "bonds-sentinel";

export interface DeskPanelProps {
  readonly panel: DeskPanelData;
}

export function DeskPanel({ panel }: DeskPanelProps) {
  const titleId = `desk-panel-${panel.id}`;
  const isAmberStatus = panel.id === AMBER_STATUS_PANEL_ID;
  const hasPulseDot = panel.id === PULSE_DOT_PANEL_ID;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "relative flex w-full flex-col border border-line bg-ink p-8 md:p-10 lg:p-12",
        "group-data-[axis=x]/desk:w-[86vw] group-data-[axis=x]/desk:shrink-0",
        "md:group-data-[axis=x]/desk:w-[64vw] lg:group-data-[axis=x]/desk:w-[46vw]",
        "group-data-[tier=lite]/desk:snap-center",
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <span className="mono-nums text-6xl leading-none text-steel/40">
          {panel.index}
        </span>
        <p className="eyebrow pt-2 text-right !text-[10px]">{panel.microcopy}</p>
      </div>

      <h3
        id={titleId}
        className="mt-8 text-3xl uppercase leading-tight text-fg md:text-4xl"
      >
        {panel.title}
      </h3>

      <p className="mt-4 max-w-[46ch] text-sm leading-relaxed text-muted md:text-base">
        {panel.body}
      </p>

      {panel.chips ? (
        <ul role="list" className="mt-6 flex flex-wrap gap-2">
          {panel.chips.map((chip) => (
            <li key={chip}>
              <Badge>{chip}</Badge>
            </li>
          ))}
        </ul>
      ) : null}

      {panel.diagram ? (
        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
          {panel.diagram.map((node, nodeIndex) => (
            <Fragment key={node}>
              {nodeIndex > 0 ? (
                <span aria-hidden="true" className="text-steel">
                  →
                </span>
              ) : null}
              <span className="eyebrow border border-line px-3 py-2 !text-[10px]">
                {node}
              </span>
            </Fragment>
          ))}
        </div>
      ) : null}

      {panel.metrics ? (
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
          {panel.metrics.map((metric) => (
            <div key={metric.label}>
              <CountUp
                value={metric.value}
                decimals={metric.decimals}
                prefix={metric.prefix}
                suffix={metric.suffix}
                className="text-4xl text-steel md:text-5xl"
              />
              <p className="eyebrow mt-2 !text-[10px]">{metric.label}</p>
            </div>
          ))}
        </div>
      ) : null}

      {panel.amberDelta ? (
        <p className="eyebrow mt-3 !text-amber">{panel.amberDelta}</p>
      ) : null}

      <div className="mt-auto flex items-center gap-3 pt-8">
        <Badge tone={isAmberStatus ? "amber" : "steel"}>{panel.status}</Badge>
        {hasPulseDot ? (
          <span
            aria-hidden="true"
            className="size-1.5 animate-pulse rounded-full bg-amber"
          />
        ) : null}
      </div>
    </article>
  );
}
