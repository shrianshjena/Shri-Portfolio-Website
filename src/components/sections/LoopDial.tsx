import { cn } from "@/lib/cn";

/*
 * Presentational instrument dial for Chapter 06, THE LOOP. A static bezel
 * (outer circle plus accent index needle at 12 o'clock) layered over a
 * separate tick ring that the parent section rotates with scroll through the
 * [data-dial-ring] hook. Decorative only: the parent renders the real detent
 * list as accessible text, so the whole dial is aria-hidden.
 */

const TICK_COUNT = 60;
const MAJOR_TICK_EVERY = 12;
const VIEW_SIZE = 220;
const DIAL_CENTER = VIEW_SIZE / 2;
const BEZEL_RADIUS = 104;
const TICK_OUTER_RADIUS = 100;
const MINOR_TICK_INNER_RADIUS = 92;
const MAJOR_TICK_INNER_RADIUS = 84;
/* Downward triangle centered on 12 o'clock, overlapping the bezel edge. */
const NEEDLE_POINTS = "104,3 116,3 110,15";

interface DialTick {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly isMajor: boolean;
}

function polarPoint(
  radius: number,
  angleDeg: number,
): readonly [number, number] {
  const angleRad = (angleDeg * Math.PI) / 180;
  return [
    DIAL_CENTER + radius * Math.sin(angleRad),
    DIAL_CENTER - radius * Math.cos(angleRad),
  ];
}

const TICKS: readonly DialTick[] = Array.from(
  { length: TICK_COUNT },
  (_, index) => {
    const angle = (index * 360) / TICK_COUNT;
    const isMajor = index % MAJOR_TICK_EVERY === 0;
    const [x1, y1] = polarPoint(
      isMajor ? MAJOR_TICK_INNER_RADIUS : MINOR_TICK_INNER_RADIUS,
      angle,
    );
    const [x2, y2] = polarPoint(TICK_OUTER_RADIUS, angle);
    return { x1, y1, x2, y2, isMajor };
  },
);

export function padTwo(value: number): string {
  return String(value).padStart(2, "0");
}

export function formatDialReadout(step: number, total: number): string {
  return `${padTwo(step)} / ${padTwo(total)}`;
}

export interface LoopDialProps {
  readonly detentCount: number;
  readonly className?: string;
}

export function LoopDial({ detentCount, className }: LoopDialProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-square w-[min(70vw,440px)] select-none",
        className,
      )}
    >
      {/* Rotating tick ring: the parent scrubs this layer's rotation. */}
      <div data-dial-ring className="absolute inset-0 will-change-transform">
        <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} className="h-full w-full">
          {TICKS.map((tick, index) => (
            <line
              key={`tick-${index}`}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={
                tick.isMajor ? "var(--color-steel)" : "var(--color-line-strong)"
              }
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      {/* Static bezel and index needle above the rotating ring. */}
      <svg
        viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`}
        className="absolute inset-0 h-full w-full"
      >
        <circle
          cx={DIAL_CENTER}
          cy={DIAL_CENTER}
          r={BEZEL_RADIUS}
          fill="none"
          stroke="var(--color-line-strong)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <polygon points={NEEDLE_POINTS} fill="var(--color-accent)" />
      </svg>

      {/* Center readout: detent index, DOM-updated by the parent on full. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          data-dial-readout
          className="mono-nums text-sm tracking-[0.22em] text-steel"
        >
          {formatDialReadout(1, detentCount)}
        </p>
      </div>
    </div>
  );
}
